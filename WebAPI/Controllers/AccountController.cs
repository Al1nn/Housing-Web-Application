using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Dtos;
using WebAPI.Errors;
using WebAPI.Extensions;
using WebAPI.Interfaces;
using WebAPI.Models;


namespace WebAPI.Controllers
{

    public class AccountController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public AccountController(IUnitOfWork uow, IConfiguration configuration, IMapper mapper)
        {
            this.uow = uow;
            this.configuration = configuration;
            this.mapper = mapper;
        }


        [HttpGet("others")]
        [Authorize]
        public async Task<IActionResult> GetOtherUsers()
        {
            int userId = GetUserId();

            var users = await uow.UserRepository.GetOtherUsersAsync(userId);

            var usersDto = mapper.Map<IEnumerable<UserDto>>(users);

            return Ok(usersDto);
        }

    
 
        //api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginReqDto loginReq)
        {

            var user = await uow.UserRepository.Authenticate(loginReq.Username, loginReq.Password, loginReq.Roles);


            ApiError apiError = new ApiError();
            if (user == null)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "Invalid user name or password or selected roles";
                apiError.ErrorDetails = "This error appear when provided user id or roles or password does not exists";
                return Unauthorized(apiError);
            }


            var loginRes = new LoginResDto();
            loginRes.Username = loginReq.Username;
            loginRes.Token = CreateJWT(user);

            return Ok(loginRes);
        }

        //api/account/verifyPassword
        [HttpGet("verifyPassword/{password}")]
        [Authorize]
        public async Task<IActionResult> Verify(string password)
        {

            int userId = GetUserId();
            bool isOldPassword = await uow.UserRepository.VerifyOldPassword(userId, password);


            return Ok(isOldPassword);
        }
        //api/account/updatePassword/{newPassword}
        [HttpPut("updatePassword/{newPassword}")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword(string newPassword)
        {
            //For safety
            ApiError apiError = new ApiError();
            if (newPassword.IsEmpty())
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "New password empty";
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }

            int userId = GetUserId();
            var user = await uow.UserRepository.GetUserById(userId);
            if (user == null)//For safety 
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorDetails = "User not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }
            byte[] passwordHash, passwordKey;
            uow.UserRepository.EncryptPassword(newPassword, out passwordHash, out passwordKey);

            user.Password = passwordHash;
            user.PasswordKey = passwordKey;

            uow.UserRepository.UpdateUser(user);

            await uow.SaveAsync();
            return StatusCode(200);

        }

        //api/account/updateAvatar/{}
        [Route("updateAvatar")]
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdatePicture(IFormFile file)
            {
            ApiError apiError = new ApiError();

            int userId = GetUserId();

            if (file == null) // For Safety
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "You didnt selected any file";
                apiError.ErrorDetails = "";
                return BadRequest(apiError);
            }

            var user = await uow.UserRepository.GetUserById(userId);

            if (user == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorDetails = "User not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            if(!user.Photo.IsEmpty())
            {
                var oldThumbnailPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails", user.Photo);
                var oldOriginalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes", user.Photo);

                if (System.IO.File.Exists(oldThumbnailPath))
                {
                    System.IO.File.Delete(oldThumbnailPath);
                }
                if (System.IO.File.Exists(oldOriginalPath))
                {
                    System.IO.File.Delete(oldOriginalPath);
                }
            }

            string originalSizesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes");
            string thumbnailsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails");


            string uniqueId = Guid.NewGuid().ToString();
            var fileName = uniqueId + '-' + file.FileName;
            var originalPath = Path.Combine(originalSizesDirectory, fileName);
            var thumbnailPath = Path.Combine(thumbnailsDirectory, fileName);

            using (var stream = new FileStream(originalPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            using (var thumbnail = await SixLabors.ImageSharp.Image.LoadAsync(originalPath))
            {
                var resizeOptions = new ResizeOptions
                {
                    Mode = ResizeMode.Crop,
                    Size = new Size(250, 250),
                    Position = AnchorPositionMode.Center
                };

                thumbnail.Mutate(x => x.Resize(resizeOptions));
                await thumbnail.SaveAsync(thumbnailPath);
            }

            user.Photo = fileName;
            uow.UserRepository.UpdateUser(user);


            var token = CreateJWT(user);
            if (await uow.SaveAsync())
            {
                
                return Ok(new { token = token });
            }


            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown Error Occured";
            apiError.ErrorDetails = "";
            return BadRequest(apiError);
        }

        [HttpDelete("delete")]
        [Authorize]
        public async Task<IActionResult> DeleteUser()
        {
            ApiError apiError = new ApiError();
            
            int userId = GetUserId();

            var user = await uow.UserRepository.GetUserById(userId);

            if (user == null)
            {
                
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "User not found";
                apiError.ErrorDetails = "User has been deleted";
                return NotFound(apiError);
            }

            if (!user.Photo.IsEmpty())
            {
                var oldThumbnailPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "thumbnails", user.Photo);
                var oldOriginalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UPLOADS", "originalSizes", user.Photo);

                if (System.IO.File.Exists(oldThumbnailPath))
                {
                    System.IO.File.Delete(oldThumbnailPath);
                }
                if (System.IO.File.Exists(oldOriginalPath))
                {
                    System.IO.File.Delete(oldOriginalPath);
                }
            }

            uow.UserRepository.DeleteUser(user);

            if(await uow.SaveAsync())
            {
                return Ok();
            }

            apiError.ErrorCode = BadRequest().StatusCode;
            apiError.ErrorMessage = "Unknown error occured";
            apiError.ErrorDetails = "";
            return BadRequest(apiError);
        }

        //api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] LoginReqDto loginReq)
        {
            ApiError apiError = new ApiError();
            if (loginReq.Username.IsEmpty() || loginReq.Password.IsEmpty() || loginReq.Email.IsEmpty() || loginReq.PhoneNumber.IsEmpty() || loginReq.Roles.Count == 0 || loginReq.Roles.IsNullOrEmpty())
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "User credentials cannot be blank or unselected";
                return BadRequest(apiError);
            }



            if (await uow.UserRepository.UserAlreadyExists(loginReq.Username))
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "User already exists, please try different user name";
                return BadRequest(apiError);
            }



            uow.UserRepository.Register(loginReq.Username, loginReq.Password, loginReq.Email, loginReq.PhoneNumber, loginReq.Roles, loginReq.file);

            await uow.SaveAsync();

            return StatusCode(201);
        }



        private string CreateJWT(User user)
        {
            var secretKey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("phone", user.PhoneNumber),
                new Claim("profile_picture",user.Photo)
            };

            foreach (Role role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Name));
            }

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);


        }
    }
}

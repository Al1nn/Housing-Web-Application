using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
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

        //api/account/user/{username}
        [HttpGet("user/{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> IsAdmin(string username)
        {
            ApiError apiError = new ApiError();

            var user = await uow.UserRepository.GetUserByName(username);

            if (user == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "User not found";
                apiError.ErrorDetails = "This error appear when provided user or role does not exist";
                return NotFound(apiError);
            }

            if(user.Role == UserRole.UserEditor)
            {
                return Ok(true);
            }

            return Ok(false);
        }
        //api/account/userProfileCard/{userId}
        [HttpGet("userProfileCard/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserProfileCard(int userId)
        {
            ApiError apiError = new ApiError();
            

            var userProfileImage = await uow.UserProfileImageRepository.GetUserProfileImageById(userId);
           
            if (userProfileImage == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "User profile card not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            var userProfileImageDto = mapper.Map<UserProfileImageDto>(userProfileImage);
            return Ok(userProfileImageDto);
        }


        //api/account/userProfileCards
        [HttpGet("userProfileCards")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserProfileCards()
        {

            var userProfileImages = await uow.UserProfileImageRepository.GetUserProfileImages();
            var userProfileImagesDto = mapper.Map<IEnumerable<UserProfileImageDto>>(userProfileImages);

            return Ok(userProfileImagesDto);
        }


        //api/account/userProfileImage
        [HttpGet("userProfileImage")]
        [Authorize]
        public async Task<IActionResult> GetProfileImage()
        {
            ApiError apiError = new ApiError();
            int userId = GetUserId();
            var userProfileImage = await uow.UserProfileImageRepository.GetUserProfileImageById(userId);

            if (userProfileImage == null)
            {
                apiError.ErrorCode = NotFound().StatusCode;
                apiError.ErrorMessage = "User profile image not found";
                apiError.ErrorDetails = "";
                return NotFound(apiError);
            }

            var userProfileImageDto = mapper.Map<UserProfileImageDto>(userProfileImage);
            return Ok (userProfileImageDto);
        }

        //api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginReqDto loginReq)
        {
            
            var user = await uow.UserRepository.Authenticate(loginReq.Username, loginReq.Password, loginReq.Role);
            
            ApiError apiError = new ApiError();
            if (user == null)
            {
                apiError.ErrorCode = Unauthorized().StatusCode;
                apiError.ErrorMessage = "Invalid user name or password or role";
                apiError.ErrorDetails = "This error appear when provided user id or password does not exists";
                return Unauthorized(apiError);
            }

            var loginRes = new LoginResDto();
            loginRes.Username = loginReq.Username;
            loginRes.Token = CreateJWT(user);
            loginRes.Role = loginReq.Role;           

            return Ok(loginRes);
        }

       

        //api/account/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginReqDto loginReq)
        {
            ApiError apiError = new ApiError();
            if ( loginReq.Username.IsEmpty() || loginReq.Password.IsEmpty() || loginReq.Email.IsEmpty() || loginReq.PhoneNumber.IsEmpty() )
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "User name or password can not be blank";
                return BadRequest(apiError);
            }
            
            if (await uow.UserRepository.UserAlreadyExists(loginReq.Username))
            {
                apiError.ErrorCode = BadRequest().StatusCode;
                apiError.ErrorMessage = "User already exists, please try different user name";
                return BadRequest(apiError);
            }
            uow.UserRepository.Register(loginReq.Username, loginReq.Password, loginReq.Email, loginReq.PhoneNumber, loginReq.ImageUrl);

            await uow.SaveAsync();

            return StatusCode(201);
        }

        private string CreateJWT(User  user)
        {
            var secretKey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var claims = new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor { 
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

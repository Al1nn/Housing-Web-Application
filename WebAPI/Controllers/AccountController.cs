using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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

        //api/account/user/{username}
        [HttpGet("user/{username}/{role}")]
        [AllowAnonymous]
        public async Task<IActionResult> IsAdmin(string username, UserRole role)
        {
            ApiError apiError = new ApiError();

            var user = await uow.UserRepository.GetUserByUsernameAndRole(username,role);

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

        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginReqDto loginReq)
        {
            ApiError apiError = new ApiError();
            if ( loginReq.Username.IsEmpty() || loginReq.Password.IsEmpty())
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
            uow.UserRepository.Register(loginReq.Username, loginReq.Password);

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
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);


        }
    }
}

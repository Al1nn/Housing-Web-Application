using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;
using System.Security.Claims;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        protected UserRole GetUserRole()
        {
            string roleValue = User.FindFirst(ClaimTypes.Role).Value;

            if ( Enum.TryParse<UserRole>(roleValue, out UserRole role) )
            {
                return role;
            }
            else
            {
                throw new InvalidOperationException("Invalid role claim value");
            }
        }

    }
}

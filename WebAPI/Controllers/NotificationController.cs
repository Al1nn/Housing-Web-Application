using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dtos;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : BaseController
    {
        private readonly IUnitOfWork uow;

        public NotificationController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpPost("sendNotification")]
        [Authorize]
        public async Task<IActionResult> SendNotification(NotificationDto notification)
        {
  
            await uow.NotificationService.SendNotificationAsync(notification.registrationToken, notification.lastMessage, notification.senderName, notification.senderPhoto);

            return Created();
        }


    }
}

using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class ThumbnailFileNameResolver : IValueResolver<Photo, PhotoDto, string>
    {
        public string Resolve(Photo source, PhotoDto destination, string destMember, ResolutionContext context)
        {
            if (source.FileName.Contains("_thumbnail"))
            {
                return source.FileName;
            }
            // Return null to indicate that the mapping should be skipped
            return null;
        }
    }
}

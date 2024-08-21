using AutoMapper;
using WebAPI.Dtos;
using WebAPI.Models;

namespace WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<City, CityDto>().ReverseMap();
            CreateMap<City, CityUpdateDto>().ReverseMap();

            CreateMap<Property, PropertyDto>().ReverseMap();


            CreateMap<Property, PropertyDetailDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<Role, RoleDto>().ReverseMap();


            CreateMap<UserImage, ImageDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(src => src.Image.Id))
                .ForMember(d => d.FileName, opt => opt.MapFrom(src => src.Image.FileName));


            CreateMap<UserImage, UserImageDto>()
                .ForMember(d => d.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(d => d.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(d => d.ImageId, opt => opt.MapFrom(src => src.Image.Id))
                .ForMember(d => d.FileName, opt => opt.MapFrom(src => src.Image.FileName));

           

            //Add methods to map Model to Dto
            CreateMap<Property, PropertyListDto>()
                .ForMember(d => d.Photo, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.PropertyId == p.Property.Id).FileName))
                .ForMember(d => d.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, opt => opt.MapFrom(src => src.City.Country))
                .ForMember(d => d.PropertyType, opt => opt.MapFrom(src => src.PropertyType.Name))
                .ForMember(d => d.FurnishingType, opt => opt.MapFrom(src => src.FurnishingType.Name));

            CreateMap<Property, PropertyDetailDto>()
                .ForMember(d => d.Photo, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.PropertyId == p.Property.Id).FileName))
                .ForMember(d => d.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, opt => opt.MapFrom(src => src.City.Country))
                .ForMember(d => d.PropertyType, opt => opt.MapFrom(src => src.PropertyType.Name))
                .ForMember(d => d.FurnishingType, opt => opt.MapFrom(src => src.FurnishingType.Name))
                .ForMember(d => d.Photos, opt => opt.MapFrom(src => src.Photos.Where( p =>  p.PropertyId == p.Property.Id )));

            CreateMap<PropertyType, KeyValuePairDto>();
            CreateMap<FurnishingType, KeyValuePairDto>();
        }
    }
}

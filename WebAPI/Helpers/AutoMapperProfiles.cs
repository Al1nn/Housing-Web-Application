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

            CreateMap<Property,PropertyDto>().ReverseMap();
            CreateMap<Property, PropertyDetailDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();

            CreateMap<UserProfileImage, UserProfileImageDto>()
                .ForMember(d => d.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(d => d.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(d => d.Role, opt => opt.MapFrom(src => src.User.Role))
                .ForMember(d => d.ImageUrl, opt => opt.MapFrom(src => src.ProfileImage.ImageUrl))
                ;
                
                
                
                

            //Add methods to map Model to Dto
            CreateMap<Property, PropertyListDto>()
                .ForMember(d => d.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, opt => opt.MapFrom(src => src.City.Country))
                .ForMember(d => d.PropertyType, opt => opt.MapFrom(src => src.PropertyType.Name))
                .ForMember(d=> d.FurnishingType, opt => opt.MapFrom(src => src.FurnishingType.Name))
                .ForMember(d=> d.Photo , opt => opt.MapFrom(src=> src.Photos.FirstOrDefault(p => p.IsPrimary).ImageUrl));

            CreateMap<Property, PropertyDetailDto>()
                .ForMember(d => d.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(d => d.Country, opt => opt.MapFrom(src => src.City.Country))
                .ForMember(d => d.PropertyType, opt => opt.MapFrom(src => src.PropertyType.Name))
                .ForMember(d => d.FurnishingType, opt => opt.MapFrom(src => src.FurnishingType.Name));

            CreateMap<PropertyType, KeyValuePairDto>();
            CreateMap<FurnishingType, KeyValuePairDto>();
        }
    }
}

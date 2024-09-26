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

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Property, PropertyDto>().ReverseMap();


            CreateMap<Property, PropertyDetailDto>().ReverseMap();
            CreateMap<Photo, PhotoDto>().ReverseMap();
            CreateMap<Role, RoleDto>().ReverseMap();


          

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
                    .ForMember(d => d.Photos, opt => opt.MapFrom(src => src.Photos.Where(p => p.PropertyId == p.Property.Id)));
    
             


            CreateMap<PropertyType, KeyValuePairDto>();
            CreateMap<FurnishingType, KeyValuePairDto>();
        }
    }
}

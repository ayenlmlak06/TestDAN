using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Entities.Account
{
    [Table("Device")]
    public class Device : BaseEntity
    {
        public Guid Id { get; set; }
        public string DeviceId { get; set; }
        public string? OSVersion { get; set; }
        public string? OSName { get; set; }
        public string? DeviceType { get; set; }
        public string? DeviceName { get; set; }
        public string? DeviceDescription { get; set; }
        public bool IsActive { get; set; } = false;
        public required string RefreshToken { get; set; }
        public required string AccessToken { get; set; }

        public Guid UserId { get; set; }
        public virtual required User User { get; set; }
    }

    public class SysDeviceConfiguration : IEntityTypeConfiguration<Device>
    {
        public void Configure(EntityTypeBuilder<Device> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.DeviceId).HasColumnType("varchar(50)").IsRequired();
            builder.Property(a => a.OSVersion).HasColumnType("varchar(50)");
            builder.Property(a => a.OSName).HasColumnType("varchar(50)");
            builder.Property(a => a.DeviceType).HasColumnType("varchar(50)");
            builder.Property(a => a.DeviceName).HasColumnType("varchar(50)");
            builder.Property(a => a.DeviceDescription).HasColumnType("nvarchar(255)");
            builder.Property(a => a.RefreshToken).HasColumnType("varchar(1000)").IsRequired();
            builder.Property(a => a.AccessToken).HasColumnType("varchar(1000)").IsRequired();
            builder.HasIndex(x => x.CreatedDate);
            builder.Property(x => x.CreatedDate).HasColumnType("datetime").IsRequired();
            builder.Property(x => x.UpdatedDate).HasColumnType("datetime");
            builder.Property(x => x.CreatedName).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Updater).HasColumnType("nvarchar(50)");
        }
    }
}

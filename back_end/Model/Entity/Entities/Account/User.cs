using Common.Enum;
using Common.Utils;
using Entity.Entities.Lesson;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Entity.Entities.Account
{
    public class User : IdentityUser
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }
        public string? Note { get; set; }
        public Role Role { get; set; }
        public string? Avatar { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid CreatedById { get; set; }
        public string? CreatedName { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? UpdatedById { get; set; }
        public string? Updater { get; set; }
        public DateTime? DeletedDate { get; set; }
        public Guid? DeletedById { get; set; }
        public bool IsDeleted { get; set; }
        public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
        public virtual ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
        public LoginType LoginType { get; set; }

        public User()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.Now;
            IsDeleted = false;
        }

        public User(string email) : this()
        {
            Email = email;
            UserName = Utils.GetUserNameFromEmail(email);
            Avatar =
                "https://itsmestogare.blob.core.windows.net/les-app/avatars/66086975-32e5-4f71-b36b-36787c0aa108.png";
        }
    }

    public class SysAccountConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(a => a.Id);
            builder.HasIndex(a => a.UserName);
            builder.HasIndex(a => a.Email);
            builder.Property(a => a.UserName).HasColumnType("varchar(50)").IsRequired();
            builder.Property(a => a.Email).HasColumnType("varchar(50)").IsRequired();
            builder.Property(a => a.Password).HasColumnType("varchar(255)");
            builder.Property(a => a.PhoneNumber).HasColumnType("varchar(10)");
            builder.Property(a => a.Avatar).HasColumnType("varchar(1000)");
            builder.Property(a => a.Note).HasColumnType("nvarchar(255)");
            builder.HasIndex(x => x.CreatedDate);
            builder.Property(x => x.CreatedDate).HasColumnType("datetime").IsRequired();
            builder.Property(x => x.UpdatedDate).HasColumnType("datetime");
            builder.Property(x => x.CreatedName).HasColumnType("nvarchar(50)");
            builder.Property(x => x.Updater).HasColumnType("nvarchar(50)");
        }
    }
}

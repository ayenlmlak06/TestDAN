namespace Entity;

public class BaseEntity
{
    public DateTime CreatedDate { get; set; }
    public Guid CreatedById { get; set; }
    public string? CreatedName { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public Guid? UpdatedById { get; set; }
    public string? Updater { get; set; }
    public DateTime? DeletedDate { get; set; }
    public Guid? DeletedById { get; set; }
    public bool IsDeleted { get; set; }
}

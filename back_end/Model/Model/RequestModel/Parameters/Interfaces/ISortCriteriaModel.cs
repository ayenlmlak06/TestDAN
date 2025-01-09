namespace Model.RequestModel.Parameters.Interfaces
{
    public interface ISortCriteriaModel
    {
        public string? Field { get; set; }
        public bool IsDescending { get; set; }
    }
}

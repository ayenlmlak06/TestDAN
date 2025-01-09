namespace Model.RequestModel.Parameters.Interfaces
{
    public interface IPaginationModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}

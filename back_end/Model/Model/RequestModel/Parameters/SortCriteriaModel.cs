using Model.RequestModel.Parameters.Interfaces;

namespace Model.RequestModel.Parameters
{
    public class SortCriteriaModel : ISortCriteriaModel
    {
        public string? Field { get; set; }
        public bool IsDescending { get; set; } = false;
    }
}

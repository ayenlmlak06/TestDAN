namespace Model.RequestModel.Parameters.Interfaces
{
    public interface ISearchCriteriaModel<T>
    {
        public T? Criteria { get; set; }
    }
}

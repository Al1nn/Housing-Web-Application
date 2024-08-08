using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ITreeRepository
    {
        Task<IEnumerable<Tree>> GetAllTreesAsync();

        Task<List<TreeResult>> GetPropertyTreeWithCursorAsync(int rootId);
    }
}

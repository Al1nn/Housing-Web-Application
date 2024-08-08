using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class TreeRepository : ITreeRepository
    {
        private readonly TreeContext tc;

        public TreeRepository(TreeContext tc)
        {
            this.tc = tc;
        }

        public async Task<IEnumerable<Tree>> GetAllTreesAsync()
        {
            return await tc.Trees.ToListAsync();
        }

        public async Task<List<TreeResult>> GetPropertyTreeWithCursorAsync(int rootId)
        {
            return await tc.GetPropertyTreeWithCursor(rootId).ToListAsync();
        }



    }
}

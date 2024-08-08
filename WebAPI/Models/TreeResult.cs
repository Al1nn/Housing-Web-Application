using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Linq;

namespace WebAPI.Models
{
    public class TreeResult
    {
        public int ParentID { get; set; }
        public int NodeID { get; set; }
        public string Path { get; set; }
        public int Level {
            get
            {
                if (Path is null)
                    return 0;

                return Path.Split("->", StringSplitOptions.RemoveEmptyEntries).Length;
            }
        }

        [Newtonsoft.Json.JsonIgnore]
        public List<int> KeysPath
        {
            get
            {
                if (Path == null)
                    return Enumerable.Empty<int>().ToList();

                return Path.Split("->", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList();
            }
        }

        [Newtonsoft.Json.JsonIgnore]
        public Dictionary<int, TreeResult> Children = new Dictionary<int, TreeResult>();


        public List<TreeResult> Properties => Children.Select(x => x.Value).ToList();
    }
}

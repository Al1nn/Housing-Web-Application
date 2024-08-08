using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Interfaces;
using WebAPI.Models;
using System.Linq;
using Microsoft.AspNetCore.Http.HttpResults;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreeController : BaseController
    {
        private readonly IUnitOfWork uow;

        public TreeController(IUnitOfWork uow)
        {
            this.uow = uow;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyTree()
        {
            var trees = await uow.TreeRepository.GetAllTreesAsync();

            return Ok(trees);
        }

        [HttpGet("procedure/{rootID}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPropertyTreeWithCursor(int rootID)
        {
            var procedure = await uow.TreeRepository.GetPropertyTreeWithCursorAsync(rootID);

            var result = new Dictionary<int, TreeResult>();
            TreeResult item = null;

            for(int i = 0; i < procedure.Count; i++)
            {
                item = procedure[i];

                if (item.ParentID == 0)
                {
                    result.Add(item.NodeID, item);
                    continue;
                }

                if (result.ContainsKey(item.ParentID))
                {
                    result[item.ParentID].Children.Add(item.NodeID, item);
                    continue;
                }
                else
                {
                    //Traverse(result.Keys.ToList(), result, item);
                    TreeResult _root = null;

                    for(int j = 0; j < item.KeysPath.Count; j++)
                    {
                        _root = j == 0 ? result[item.KeysPath[j]] : _root.Children[item.KeysPath[j]];

                        if (!result.ContainsKey(item.KeysPath[j]))
                        {
                            break;
                        }
                        
                    }

                    if(_root != null && !_root.Children.ContainsKey(item.ParentID))
                    {
                        _root.Children.Add(item.NodeID, item);
                        _root = null;
                    } else
                    {
                        _root.Children[item.ParentID] = item;
                    }

                    
                    
                }
            }


            return Ok(result.Values);
        }

        private void Traverse(List<int> Keys, Dictionary<int, TreeResult> tree, TreeResult crtItem)
        {
           
            foreach (var key in Keys)
            {
                if (tree[key].Children.Count > 0 && tree[key].Children.ContainsKey(crtItem.ParentID))
                {
                    tree[key].Children[crtItem.ParentID].Children.Add(crtItem.NodeID, crtItem);
                }
                else if (!tree[key].Children.ContainsKey(crtItem.ParentID) ) 
                  
                {
                  

                    tree[key].Children.Add(crtItem.NodeID, crtItem);
                }
                else
                {
                    Traverse(Keys, tree[key].Children, crtItem);
                }
            }
        }




    }
}

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

           


            Dictionary<int, TreeResult> nodeDict = procedure.ToDictionary(n => n.NodeID);

            foreach(var node in procedure)
            {
                if(node.ParentID != 0 && nodeDict.ContainsKey(node.ParentID))
                {
                    nodeDict[node.ParentID].Children[node.NodeID] = node;
                }
            }

            var rootNodes = procedure.Where(n => n.ParentID == 0).ToList();

            foreach(var rootNode in rootNodes)
            {
                TraverseNode(rootNode, 0);
            }

            return Ok(rootNodes);
        }

        private void TraverseNode(TreeResult node, int depth)
        {
            foreach(var child in node.Children.Values)
            {
                TraverseNode(child, depth + 1);
            }
        }


        




    }
}

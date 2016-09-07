/**
 * 
 * @param $
 */
(function($){
	var logger=function(msg){
		console.log(msg);
		alert(msg);
	};
	/**
	 * 校验参数
	 * data 参数必须是数组，
	 * 每个node节点,必须参数:text,href,state.checked
	 * href 为标示id，不能传-1值，该值标示无效
	 */
	var validateOptionData=function(data){
		if($.type(data)!='array' || data.length==0){
			logger("参数必须是非空数组！");
			return;
		}
		for(var i=0;i<data.length;i++){
			var node=data[i];
			if(node.text==null || node.text=="undefined"){
				node.text="未命名节点";
			}
			if(node.href==null || node.href=="undefined"){
				node.href=-1;
			}else{
				try{
					node.href=parseInt(node.href);
				}catch(e){
					logger("节点 href属性必须是整形");
				} 
			}
			if(node.state==null || node.state=="undefined"){
				node.state={};
			}
			if(node.state.checked==null || node.state.checked=="undefined"){
				node.state.checked=false;
			}
			if(node.nodes && $.type(node.nodes)=="array" && node.nodes.length > 0){
				validateOptionData(node.nodes);
			}
		}
	};
	var initIds=function(data,parent){
		var ids=[];
		var getCheckedIdFromNode=function(data,parent){
			var isCheckParent=false;
			var checkedCount=0;
			for(var i in data){
				var node=data[i];
				if(node.state.checked){
					checkedCount++;
				}
				if(node.state.checked && node.href!=-1){
					ids.push(node.href);
				}
				if(node.nodes && node.nodes.length > 0){
					getCheckedIdFromNode(node.nodes,node);
				}
			}
			if(checkedCount==data.length){
				if(parent!=null){
					parent.state.checked=true;
					if(parent.href!=-1){
						ids.push(parent.href);
					}
				}
			}
		}
		getCheckedIdFromNode(data);
		return ids;
	};
	$.widget("cafe.tree",{
		 options:{isSingleCheck:false,ids:[]},
		_create: function() {
			 this._update();
	    },
	    _setOption: function(key, value) {
	        this.options[key] = value;
	        this._update();
	    },
	    _update: function() {
	    	 var $this=this;
	    	 validateOptionData(this.options.data);
	    	 this.options.ids=initIds(this.options.data,null);
		     this.element.treeview({
		          data: this.options.data,
		          showIcon: true,
		          showTags:true,
		          showCheckbox: true,
		          onNodeChecked: function(event, node) {
		        	  if(node.href!=-1){
		        		  $this.options.ids.push(node.href);
			   		   }
		        	  if($this.options.isSingleCheck){
		        		  $this.singeleCheck(node);
		        	  }else{
		        		  $this.check(node);
		        	  }
		        	 
		          },
		          onNodeUnchecked: function (event, node) {
		        	  if(node.href!=-1){
		        		  var id=node.href;
		        		  var index=$.inArray(id,$this.options.ids);
		        		  if(index!=-1){
		        			 $this.options.ids.splice(index,1);
		        		  }
			   		   }
		        	  if($this.options.isSingleCheck){
		        		 
		        	  }else{
		        		  $this.uncheck(node);
		        	  }
		          }
		        });
	    },
	    check:function(node){
	    	if(node.nodes && node.nodes.length>0){
       		 	for(var index in node.nodes){
       		 		var childNode=node.nodes[index];
       	            this.element.treeview("checkNode",[childNode.nodeId,{ silent: false }]);
       		 	}
       	 	}
	    	var siblingNodes= this.element.treeview("getSiblings",node);
			var checkedCount=0;
	    	for(var i=0;i<siblingNodes.length;i++){
	    		var siblingNode=siblingNodes[i];
	    		if(siblingNode.state.checked==true){
	    			checkedCount++;
	    		}
	    	}
	    	if(checkedCount==siblingNodes.length){
	    		var parentNodes= this.element.treeview("getParent",node.nodeId);
	    		if(parentNodes!=null && parentNodes!="undefined" && parentNodes.state!=null && parentNodes.state!='undefined' && !parentNodes.state.checked){
	    			this.element.treeview("checkNode",[parentNodes.nodeId,{silent: false}]);
	    			if(parentNodes.href!=-1){
	    				  var index=$.inArray(parentNodes.href,this.options.ids);
		        		  if(index!=-1){
		        			  this.options.ids.push(parentNodes.href);
		        		  }
	    			}
	    		}	
	    	}
		},
		uncheck:function(node){
	    	if(node.nodes && node.nodes.length>0){
       		 	for(var index in node.nodes){
       		 		var childNode=node.nodes[index];
       	            this.element.treeview("uncheckNode",[childNode.nodeId,{ silent: false }]);
       		 	}
       	 	}
		},
		singeleCheck:function(node){
			 this.element.treeview('uncheckAll', { silent: true });
			 this.element.treeview("checkNode",[node.nodeId,{ silent: true }]);
			 if(node.href!=-1){
				 this.options.ids=[node.href];
			 }else{
				 this.options.ids=[];
			 }
			 
		},
		getCheckedId:function(){
			 return this.options.ids;
		}
	});
})(window.jQuery)
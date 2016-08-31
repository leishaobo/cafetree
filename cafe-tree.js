/**
 * 
 * @param $
 */
(function($){
	var DEFAULT_OPTIONS={
			isSingleCheck:false
	};
	
	var initIds=function(data){
		var ids=[];
		var getCheckedIdFromNode=function(data){
			for(var i in data){
				var node=data[i];
				if(node.state && node.state.checked && node.href){
					ids.push(parseInt(node.href));
				}
				if(node.nodes && node.nodes.length > 0){
					getCheckedIdFromNode(node.nodes);
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
			 this.options.ids=initIds(this.options.data);
		     this.element.treeview({
		          data: this.options.data,
		          showIcon: true,
		          showTags:true,
		          showCheckbox: true,
		          onNodeChecked: function(event, node) {
		        	  if(parseInt(node.href)){
		        		  $this.options.ids.push(parseInt(node.href));
			   		   }
		        	  if($this.options.isSingleCheck){
		        		  $this.singeleCheck(node);
		        	  }else{
		        		  $this.check(node);
		        	  }
		        	 
		          },
		          onNodeUnchecked: function (event, node) {
		        	  if(parseInt(node.href)){
		        		  var id=parseInt(node.href);
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
			 if(parseInt(node.href)){
				 this.options.ids=[parseInt(node.href)];
			 }else{
				 this.options.ids=[];
			 }
			 
		},
		getCheckedId:function(){
			 return this.options.ids;
		}
	});
})(window.jQuery)
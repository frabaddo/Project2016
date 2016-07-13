function Conference (conf) {
	var subs = [];
	for(var i = 0; i < conf['submissions'].length; i++)
		subs.push(new Submissions(conf['conference'], conf['submissions'][i]));
	
	var self = {
		conference : conf['conference'],
		acronym : conf['acronym'],
		chairs : conf['chairs'],
		pc_members : conf['pc_members'],
		submissions : subs,
		
		//ritorna 1 se sei chair dell'evento, 0 altrimenti
		IsChair : function(){
			for(var j = 0; j < this.chairs.length; j++)
				if (this.chairs[j].indexOf(userInfo['email']) > -1)
					return 1;

			return 0;
		},
		
		//ritorna 1 se sei reviewer di almeno un articolo della conference, 0 altrimenti
		IsReviewer : function(){
			for (var i = 0; i < this.submissions.length; i++)
				for (var j = 0; j < this.submissions[i].reviewers.length; j++)
					if (this.submissions[i].reviewers[j].indexOf(userInfo['email']) > -1)
						return 1;

			return 0;
		}  
	};
	return self;
}

function Submissions (conf, sub) {
	var self = {
		conference : conf,
		title : sub['title'],
		authors : sub['authors'],
		url : sub['url'],
		reviewers : sub['reviewers'],
		annotations : [],
		
		//ritorna 1 se sei reviewer dell'articolo, 0 altrimenti 
		IsReviewer : function(){
			for (var j = 0; j < this.reviewers.length; j++)
				if (this.reviewers[j].indexOf(userInfo['email']) > -1)
				return 1;
			return 0;
		},
	
		//ritorna 1 se hai già preso una decisione sull'articolo (chair only)
		HaveDecision : function(){
			for(var i = 0; i < this.annotations.length; i++)
				for(var j = 0; j < this.annotations[i].length; j++){
					var item = this.annotations[i][j];
					if (item['@type'] == "decision")
					return 1;
				}
			return 0;
		},

		//ritorna 1 se hai già revisionato l'articolo (reviewer only)
		HaveReview : function(){
			for(var i = 0; i < this.annotations.length; i++)
				for(var j = 0; j < this.annotations[i].length; j++){
					var item = this.annotations[i][j];
					if (item['@type'] == "review" && item['article']['eval']['author'].indexOf(userInfo['email']) > -1)
						return 1;
				}
			return 0;
		},
		
		//ritorna 1 se l'articolo ha finito tutte le fasi di revisione (chair only)
		ReviewComplete : function(){
			var result = 1;
			for(var r = 0; r < this.reviewers.length; r++){ //ciclo tutti i reviewers
				var find = 0;
				for(var i = 0; i < this.annotations.length; i++){
					for(var j = 0; j < this.annotations[i].length; j++){
						var item = this.annotations[i][j];
						if (item['@type'] == "review"){
							var author = item['article']['eval']['author'].substring(7, item['article']['eval']['author'].length);
							if (this.reviewers[r].indexOf(author) > -1)
								find = 1;
						}
					}
				}
				result &= find;
			}
			return result;
		},
		
		//ritorna la lista di revisioni (chair only)
		GetReviews : function(){
			var result = [];
			for(var i = 0; i < this.annotations.length; i++){
				for(var j = 0; j < this.annotations[i].length; j++){
					var item = this.annotations[i][j];
					if (item['@type'] == "review"){
						result.push(item);
					}
				}
			}
			return result;
		}
	};
	return self;
}
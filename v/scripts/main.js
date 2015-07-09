function select(el){
	if(!el.parentNode.classList.contains('normal')){
		el.parentNode.classList.toggle('selected')
	} else {
		el.parentNode.parentNode.parentNode.classList.toggle('selected')
	}
}
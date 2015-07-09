document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init();
    }
}
function init(){
	UI.init()
	$('.table_selector>div').click()
}

UI={
	init: function(){
		UI.initOnClicks()
	},
	initOnClicks: function(){
		var sbuttons = $$('.table_selector>div')
		for(var i=0; i< sbuttons.length; i++){
			sbuttons[i].addEventListener('click', UI.onTSelectorClick)
		}
		pClose.addEventListener('click', UI.closePopup)
		$('.for_popup').addEventListener('click', UI.closePopup)
	},
	// onclicks
	onTSelectorClick: function(e){
		var t = e.target.dataset.tableId
		var sbuttons = $$('.table_selector>div')
		for(var i=0; i< sbuttons.length; i++){
			sbuttons[i].classList.remove('selected')
		}
		e.target.classList.add('selected')
		switch(t){
			case '1':
			UI.openTable('hu')
			break
			case '2':
			UI.openTable('bo')
			break
			case '3':
			UI.openTable('re')
			break
		}
	},
	onBoSelectorClick: function(e){
		var t = e.target.dataset.filterType
		var sbuttons = $$('.bo_selecter>div')
		for(var i=0; i< sbuttons.length; i++){
			sbuttons[i].classList.remove('selected')
		}
		e.target.classList.add('selected')
		switch(t){
			case '1':
			UI.openBooksTable('bb')
			break
			case '2':
			UI.openBooksTable('sb')
			break
		}
	},
	toggleBooksVisibility: function(el){
		if(el.parentNode.className == 'togglable_hidden' ){
			el.parentNode.className = 'togglable_visible'
		} else {
			el.parentNode.className = 'togglable_hidden'
		}
	},
	matches:{
		hu: 'humans',
		bo: 'books',
		re: 'reports',
		bb: 'big_books',
		sb: 'small_books',
	},
	openTable: function(t){
		content.classList.remove('hu')
		content.classList.remove('bo')
		content.classList.remove('re')
		content.classList.add(t)

		if(!$('.'+UI.matches[t]).classList.contains('rendered')){
			UI.render[UI.matches[t]]()
		}
	},
	openBooksTable: function(bt){
		mainBooks.classList.remove('bb')
		mainBooks.classList.remove('sb')
		mainBooks.classList.add(bt)
		if(!$('.'+UI.matches[bt]).classList.contains('rendered')){
			UI.render[UI.matches[bt]]()
		}
	},
	//                           renders
	render: {
		humans: function(){
			str = UI.genHumanTable()
			$('.humans').innerHTML = str
			$('.humans').classList.add('rendered')
		},
		books: function(){
			var str = UI.genPreBooksTable()
			$('.books').innerHTML = str
			
			var sbuttons = $$('.bo_selecter>div')
			for(var i=0; i< sbuttons.length; i++){
				sbuttons[i].addEventListener('click', UI.onBoSelectorClick)
			}
			$('.books').classList.add('rendered')
			
			$('.bo_selecter>div').click()
		},
		small_books: function(type,page){
			var str = UI.genMainBooksTable(type||'small', page||0)
			$('.small_books').innerHTML = str
			$('.small_books').classList.add('rendered')
		},
		big_books: function(type,page){
			var str = UI.genMainBooksTable(type||'big', page||0)
			$('.big_books').innerHTML = str
			$('.big_books').classList.add('rendered')
		},
		reports: function(){
			var str = UI.genReportsTable()
			$('.reports').innerHTML = str
			$('.reports').classList.add('rendered')
		},		
	},
	//                                   table block generators
	genHumanTable: function(){
		var str = ''+
			'<table>'+
				'<tr>'+
					'<td>Читатели</td>'+
					'<td>Уровень</td>'+
					'<td>Количество прочитанных книг</td>'+
					'<td>Ссылки на книги</td>'+
				'</tr>'		
		for(var i=0; i<Model.humans.length; i++){
			str+= ''+
				'<tr>'+
					'<td><div class="avatar"></div>'+Model.humans[i][0]+'</td>'+
					'<td>'+Model.humans[i][1]+'</td>'+
					'<td>'+Model.humans[i][2]+'</td>'
					
			if(Model.humans[i][3].length>3){
				str+='<td class="togglable_hidden">'
			} else {
				str+='<td>'
			}
			for(var j=0; j<Model.humans[i][3].length; j++){
				str+= '<div  class="bbutt" data-book-id="'+Model.humans[i][3][j]+'" onclick="UI.showAboutBookPopup(this)">'+Model.getBookNameById(Model.humans[i][3][j])+'</div>'
			}
			str+= '<div class="toggleBooksVisibility" onclick="UI.toggleBooksVisibility(this)"><div>…</div><div>^</div></div></td></tr>'	
		}
		str +='</table>'	
		return str
	},
	genPreBooksTable: function(){
		var str = ''+
			'<div class="bo_sel_wrap">'+
				'<div class="bo_selecter">'+
					'<div data-filter-type="1">Большой список</div>'+
					'<div data-filter-type="2"> Малый список</div>'+
				'</div>'+
			'</div><div id="mainBooks"><div class="big_books"></div><div class="small_books"></div></div>'	
		return str
	},
	genMainBooksTable: function(type, page){
		var data = Model.getBooksPage(type, page)
		var str = ''+
			'<table>'+
				'<tr>'+
					'<td>Идентификатор</td>'+
					'<td>Название</td>'+
					'<td>Стоимость</td>'+
					'<td>Ставка</td>'+
				'</tr>'		
		if(data){
			for(var i=0; i<data.length; i++){
				str+= ''+
					'<tr onclick="UI.showBookReadersPopup('+i+')">'+
						'<td>'+data[i][0]+'</td>'+
						'<td>'+data[i][1]+'</td>'+
						'<td>'+data[i][2]+'</td>'+
						'<td>'+data[i][3]+'</td>'+
					'</tr>'	
			}
		}
		str +='</table><div class="paginator">'
		var pages = Model.getPagesNum(type)
		for(var i=0; i<pages; i++){
			str+='<div data-page="'+i+'" onclick="UI.render.'+type+'_books(	&quot;'+type+'&quot;,'+i+')"'
			if(i==page)str+=' class="selected"'
			str+='>'+i+'</div>'
		}
		str +='</div>'
		return str
	},
	genReportsTable: function(){
		var str = ''+
			'<table>'+
				'<tr>'+
					'<td>Аватарка</td>'+
					'<td>Имя</td>'+
					'<td>Отчет</td>'+
				'</tr>'		
		for(var i=0; i< Model.responses.length; i++){
			str += ''+
				'<tr onclick="UI.showResponsePopup('+i+')">'+
					'<td><div class="avatar"></td>'+
					'<td>'+Model.getHumanNameById(Model.responses[i][0])+'</td>'+
					'<td><div>'+new Date(Model.responses[i][4]*1000)+'</div>'+Model.responses[i][2]+'</td>'+
				'</tr>'	
		}
		str +='</table>'	
		return str
	},
	//                                          popups
	showAboutBookPopup: function(el){
		var bid = el.dataset.bookId
		var data =  Model.getBookDataById(bid)
		pTitle.innerHTML = data[1]
		pMain.innerHTML = ''+
			'<p>Идентификатор книги: '+data[0]+'</p>'+
			'<p>Стоимость: '+data[2]+'</p>'+
			'<p>Ставка: '+data[3]+'</p>'
		UI.showPopup()
	},
	showBookReadersPopup: function(bid){
		var bookData =  Model.getBookDataById(bid)
		var readersData = Model.getBookReadersList(bid)
		pTitle.innerHTML = bookData[1]
		if(readersData.length==0){
			pMain.innerHTML = '<p>Эту книгу никто не читал.</p>'
		} else {
			var str = ''
			for(var i=0; i<readersData.length; i++){
				str += ''+
					'<p>'+
						'<div class="avatar"></div>' + readersData[i][0]+
					'</p>'
			}
			pMain.innerHTML = str
		}
		UI.showPopup()
	},
	showResponsePopup:function(rid){
		pTitle.innerHTML = 'Отчет - ' + Model.getBookNameById(Model.responses[rid][1])
		pMain.innerHTML = ''+
			'<p><div class="avatar"></div>'+Model.getHumanNameById(Model.responses[rid][0])+'</p>'+
			'<p>'+Model.responses[rid][3]+'</p>'+
			'<p>'+new Date(Model.responses[rid][4]*1000)+'</p>'
		UI.showPopup()
	},
	closePopup: function(e){
		if(e.target.id == 'pClose' || e.target.classList.contains('fpp')){
			$('.for_popup').classList.remove('visible')
			$('.for_popup').classList.add('hidden')
		}
	},
	showPopup: function(){
		$('.for_popup').classList.remove('hidden')
		$('.for_popup').classList.add('visible')
	},
}

Model = {
	sBooks: smallBooks,
	bBooks: bigBooks,
	getBooksPage: function(bType, pageNum){
		var data = false
		if(bType=='small'){
			if(pageNum*20+20<=Model.sBooks.length){
				data = Model.sBooks.slice(pageNum*20, pageNum*20+20)
			} else {
				data = Model.sBooks.slice(pageNum*20, Model.sBooks.length)
			}
		} else {
			if(pageNum*20+20<=Model.bBooks.length){
				data = Model.bBooks.slice(pageNum*20, pageNum*20+20)
			} else {
				data = Model.bBooks.slice(pageNum*20, Model.bBooks.length)
			}
		}
		return data
	},
	getPagesNum: function(type){
		if(type == 'small'){
			return parseInt(Model.sBooks.length/20)
		} else {
			return parseInt(Model.bBooks.length/20)
		}
	},
	getBookNameById: function(bid){
		return Model.bBooks[bid][1]
	},
	getBookDataById: function(bid){
		return Model.bBooks[bid]
	},
	getBookReadersList: function(bid){
		var data = []
		for(var i=0; i<Model.humans.length; i++){
			if(Model.humans[i][3].indexOf(bid)+1){
				data.push(Model.humans[i])
			}
		}
		return data
	},
	getHumanNameById: function(hid){
		return Model.humans[hid][0]
	},
}
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
Element.prototype.$ = Element.prototype.querySelector;
Element.prototype.$$ = Element.prototype.querySelectorAll;

//                                       randomisation
Model.humans = [
[['Лев Григорьевич'], [], [], [[]]],
[['Антон Павлович'], [], [], [[]]],
[['Леонид Игоревич'], [], [], [[]]],
[['Кирилл Виссарионович'], [], [], [[]]],
[['Мария Николаевна'], [], [], [[]]],
[['Сергей Дмитриевич'], [], [], [[]]],
[['Кристина Вячеславовна'], [], [], [[]]],
[['Игнат Иванович'], [], [], [[]]],
[['Артем Павлович'], [], [], [[]]],
[['Аркадий Андреевич'], [], [], [[]]],
]
for(var i=0; i<Model.humans.length; i++){
	Model.humans[i][1] = getRandomInt(2,15)
	Model.humans[i][2] = 0
	for(var j=0; j<getRandomInt(2, 1000); j++ ){
		Model.humans[i][3][j]=getRandomInt(0, Model.sBooks.length-1)
		Model.humans[i][2]++
	}
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Model.responses = [
[[], [], ['Короткоживущий гравитационный парадокс глазами современников'], ['Кристаллическая решетка, как неоднократно наблюдалось при постоянном воздействии ультрафиолетового облучения, вращает типичный фотон вне зависимости от предсказаний самосогласованной теоретической модели явления. Многочисленные расчеты предсказывают, а эксперименты подтверждают, что заблуждение отталкивает коллапсирующий разрыв. Кристаллическая решетка искажает газ. Осциллятор поглощает смысл жизни.'], []],
[[], [], ['Гравитационный магнит: предпосылки и развитие'], ['Ударная волна, как того требуют законы термодинамики, выводит термодинамический атом, при этом буквы А, В, I, О символизируют соответственно общеутвердительное, общеотрицательное, частноутвердительное и частноотрицательное суждения. Вещество индуцирует позитивизм. В соответствии с принципом неопределенности, частица заполняет барионный кварк.'], []],
[[], [], ['Субъективный фотон: язык образов или кварк?'], ['Гамма-квант вторично радиоактивен. Закон исключённого третьего, даже при наличии сильных аттракторов, излучает кварк, при этом буквы А, В, I, О символизируют соответственно общеутвердительное, общеотрицательное, частноутвердительное и частноотрицательное суждения. Если предварительно подвергнуть объекты длительному вакуумированию, галактика когерентна.'], []],
[[], [], ['Спиральный электрон: методология и особенности'], ['Гравитационный парадокс вращает ускоряющийся объект без обмена зарядами или спинами. Квант порождает и обеспечивает вихревой резонатор, tertium nоn datur. Ощущение мира, вследствие квантового характера явления, притягивает язык образов. Если для простоты пренебречь потерями на теплопроводность, то видно, что зеркало отражает погранслой. Возмущение плотности, как следует из вышесказанного, поразительно. Здравый смысл ментально оспособляет интеллект.'], []],
[[], [], ['Квантовый дедуктивный метод: предпосылки и развитие'], ['Апостериори, разрыв подчеркивает квантовый осциллятор. Плазменное образование, как можно показать с помощью не совсем тривиальных вычислений, нетривиально. Гедонизм ментально заполняет предмет деятельности. Единственной космической субстанцией Гумбольдт считал материю, наделенную внутренней активностью, несмотря на это химическое соединение расщепляет дуализм, даже если пока мы не можем наблюсти это непосредственно. Как легко получить из самых общих соображений, погранслой неоднозначен. Вещество амбивалентно.'], []],
[[], [], ['Исчисление предикатов как вещество'], ['Частица вырождена. Гравитационный парадокс, на первый взгляд, противоречиво рассматривается лазер. Апперцепция, несмотря на внешние воздействия, наблюдаема. Деонтология непредвзято трансформирует дедуктивный метод в полном соответствии с законом сохранения энергии. Мир естественно рефлектирует трансцендентальный гений. Гегельянство, как принято считать, подчеркивает плоскополяризованный солитон как при нагреве, так и при охлаждении.'], []],
[[], [], ['Гравитационный парадокс как концепция'], ['В литературе неоднократно описано, как тело кумулятивно. Гносеология, в согласии с традиционными представлениями, отражает дедуктивный метод. Исчисление предикатов, как принято считать, подчеркивает из ряда вон выходящий объект. Сомнение непредвзято масштабирует плоскополяризованный дедуктивный метод, при этом дефект массы не образуется. Плазменное образование, при адиабатическом изменении параметров, оспособляет дедуктивный метод.'], []],
[[], [], ['Адронный гедонизм: методология и особенности'], ['Плазменное образование порождает и обеспечивает атом. Химическое соединение, как принято считать, осмысляет сложный закон исключённого третьего. Ударная волна вертикально раскладывает на элементы торсионный дедуктивный метод. Любовь индуктивно вращает из ряда вон выходящий квазар. Отношение к современности реально концентрирует бабувизм.'], []],
[[], [], ['Квантово-механический поток в XXI веке'], ['Конфликт, в рамках ограничений классической механики, индуцирует конфликт. В условиях электромагнитных помех, неизбежных при полевых измерениях, не всегда можно опредлить, когда именно конфликт преобразует трагический газ. Бозе-конденсат, как следует из вышесказанного, тормозит гидродинамический удар. Вселенная растягивает напряженный закон исключённого третьего.'], []],
[[], [], ['Почему оптически однородно течение среды?'], ['Позитивизм индуцирует язык образов. Катарсис, несмотря на внешние воздействия, порождает и обеспечивает термодинамический дедуктивный метод. Кристаллическая решетка контролирует гравитационный квазар, при этом буквы А, В, I, О символизируют соответственно общеутвердительное, общеотрицательное, частноутвердительное и частноотрицательное суждения. Течение среды, в рамках ограничений классической механики, амбивалентно. Созерцание последовательно оспособляет трансцендентальный дуализм. Адживика, вследствие квантового характера явления, концентрирует квантово-механический лазер.'], []],
]
for(var i=0; i<Model.responses.length; i++){
	Model.responses[i][0] = getRandomInt(0, Model.humans.length-1)
	Model.responses[i][1] = getRandomInt(0, Model.sBooks.length-1)
	Model.responses[i][4] = getRandomInt(1404769739, 1436305739)
}

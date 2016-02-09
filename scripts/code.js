var filenames = [];
var activeThreads = 0;

function traverse(url) {
	// TODO: move this to backend
	activeThreads++;

	$.ajax({
		url: url,
		success: function(data) {
			var regex = /<td><a href="[^"]*"/g, result;
			while(result = regex.exec(data)) {
				var fname = result[0].slice(13, -1);
				if (/^\//.test(fname))
					continue;

				if (/\/$/.test(fname)) {
					// console.log("Found a folder: " + url + fname);
					traverse(url + fname);
				} else {
					// console.log("Found a file: " + url + fname);
					filenames.push(url + fname);
				}
			}

			activeThreads--;
			if (activeThreads == 0) {
				var tmp = [];
				for (var i = 0; i < filenames.length; i ++) {
					tmp.push(filenames[i].slice(10));
				}
				localStorage.setItem('cache', tmp.join(';'));
				filenames = tmp;

				on_load();
			}
		}
	});
}

if (localStorage.getItem('cache') && localStorage.getItem('cache').length) {
	filenames = localStorage.getItem('cache').split(';');
	on_load();
} else {
	traverse('mans/');
}

function load_and_parse(fname, comp) {
	var tmp = fname.split('.');
	var url = "mans/man" + tmp[tmp.length - 1 - comp][0] + "/" + fname;
	// See https://developer.mozilla.org/en/DOM/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	$.ajax({
		dataType: 'text',
		mimeType: 'text/plain; charset=x-user-defined',
		url: url,
		async: true,
		cache: true,
		success: function (theContent) {
			chunk = [];
			for (var i = 0; i < theContent.length; i++) {
				chunk.push(theContent.charCodeAt(i) & 0xFF);
			}

			var str = String.fromCharCode.apply(null, chunk);

			if (comp) {
				var inflate = new Zlib.Gunzip(chunk);
				var plain = inflate.decompress();
				str = String.fromCharCode.apply(null, plain);
			}
			
			$('#manPage').html(Manolo(str).toHTML());
			$('body').scrollTo('#manPage', 500);
		}
	});

}

function on_load() {
	groups = []
	names_by_group = {}

	for (var i = 0; i < filenames.length; i++) {
		var tmp = filenames[i].split('.');
		var group = ~~tmp[tmp.length - 2][0];
		if (groups.indexOf(group) < 0)
			groups.push(group);
		if (!names_by_group[group])
			names_by_group[group] = [];
		names_by_group[group].push(filenames[i]);
	}

	groups.sort();

	$('#groupSelector').html('<b>Groups:</b> ');
	for (var i = 0; i < groups.length; i++) {
		$('#groupSelector').append('<a href="javascript:void(0)" onclick="select_group(' + groups[i] + ')">' + groups[i] + '</a> ');
	}
}

function select_group(num) {
	$('#pageSelector').html('<b>Pages:</b><br>');
	for (var i = 0; i < names_by_group[num].length; i++) {
		var comp = (names_by_group[num][i].split('.').pop() == 'gz')
		var pretty_name = names_by_group[num][i].split('.').slice(0, -1 - comp).join('.');
		$('#pageSelector').append('<a href="javascript:void(0)" onclick="load_and_parse(\'' + names_by_group[num][i] + '\', ' + comp + ')">' + pretty_name + '</a><br>');
	}
}
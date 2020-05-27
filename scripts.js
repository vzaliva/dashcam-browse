function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);
    const hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function play(name, url, width, height) {
    var new_window = window.open('', '_blank');
    new_window.document.write(
        `<!doctype html><html><head><title>${name}</title><meta charset="UTF-8" /></head>
           <body>
             <video width="${width}" height="${height}" controls autoplay>
               <source src=${url} type="video/mp4">
             </video>
           </body>
         </html>`);
}

$(() => {

    let offset = 0;
    const limit = 20;
    let dl_url;

    const load = () => {

        //TODO
        const url = 'https://raw.githubusercontent.com/vzaliva/dashcam-browse/master/sample_list.xml';

        const qry = {
            backward: 1,
            count: limit,
            property: 'Normal',
            from: offset,
            action: 'dir',
            format: 'all'
        };

        $.get(url + '?' + $.param(qry)).then(function(xmlString) {

            var xmlDoc = $.parseXML( xmlString );
            var $xml = $( xmlDoc );
            
            if (!$xml) {
                $('#btn-more').hide();
                return;
            }
            let files = new Array();
            $xml.find('file').each(function() {
                name = $('name', this).text();
                tmpThumb = $('thumb', this).text();
                files.push({
                    "name": $('name', this).text(),
                    "size": $('size', this).text(),
                    "time": $('time', this).text(),
                    "attr": $('attr', this).text(),
                    "resolution": $('format', this).attr('size'),
                    "duration": $('format', this).attr('time'),
                    "fps": $('format', this).attr('fps')
                })});
            offset += files.length;
            if (files.length < limit) {
                $('#btn-more').hide();
            };
            $('#table').bootstrapTable('append', files);
        });
    };
    
    $('#table').bootstrapTable({
        columns: [{
            field: 'name',
            title: 'Name',
            formatter: (value, row, index) => {
                const nl = value.split("/");
                const justname = nl[nl.length-1] ;
                const relpath = value.startsWith('/') ? value.substr(1) : value;
                let width,height;
                [width,height] = row["resolution"].split("x") ;
                const mov_url = CONFIG['cameraURL']+relpath;
                return `<a href="#" onclick="play('${justname}','${mov_url}',${width},${height})">${justname}</a>`+
                    `&nbsp;&nbsp;[<a href="${mov_url}">\u21E9</a>]`;
            }
        }, {
            field: 'time',
            title: 'Date',
            formatter: (value, row, index) => {
                return value.split(" ")[0];
            }
        }, {
            field: 'time',
            title: 'Time',
            formatter: (value, row, index) => {
                return value.split(" ")[1];
            }
        },                  {
            field: 'size',
            title: 'Size',
            formatter: (value, row, index) => {
                return formatBytes(value,2);
            }
        },{
            field: 'duration',
            title: 'Duration',
            formatter: (value, row, index) => {
                return secondsToHms(Math.round(parseFloat(value)));
            }
        }]
    });

    $('#btn-more').click(() => {
        load();
    });
    load();
});

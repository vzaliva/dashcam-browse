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

$(() => {

    let offset = 0;
    const limit = 20;
    let dl_url;

    const load = () => {

        const url = '/list';

        const qry = {
            backward: 1,
            count: limit,
            property: 'Normal',
            from: offset,
            action: 'dir',
            format: 'all'
        };

        $.getJSON(url + '?' + $.param(qry)).then(function(res) {
            if (!res) {
                $('#btn-more').hide();
                return;
            }
            if (!res.Normal) {
                $('#btn-more').hide();
                return;
            }
            if (!res.Normal.file) {
                $('#btn-more').hide();
                return;
            }
            offset += res.Normal.file.length;
            if (res.Normal.file.length < limit) {
                $('#btn-more').hide();
            };
            dl_url = res.URL;
            $('#table').bootstrapTable('append', res.Normal.file);
        });
    };
    
    $('#table').bootstrapTable({
        columns: [{
            field: 'name',
            title: 'Name',
            formatter: (value, row, index) => {
                const nl = value.split("/");
                const justname = nl[nl.length-1] ;
                const relapth = value.startsWith('/') ? value.substr(1) : value;
                let width,height;
                [width,height] = row["format"]["@size"].split("x") ;
                return `<a href="/show?path=${value}&width=${width}&height=${height}">${justname}</a>`+
                    `&nbsp;&nbsp;[<a href="${dl_url}${relapth}">\u21E9</a>]`;
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
            field: 'format.@time',
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

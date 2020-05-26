$(() => {

    let offset = 0;
    const limit = 20;

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
            $('#table').bootstrapTable('append', res.Normal.file);
        });
    };


    $('#table').bootstrapTable({
        columns: [{
            field: 'name',
            title: 'Name',
            formatter: (value, row, index) => {
                return '<a href="https://google.com">' + value + '</a>';
            }
        }, {
            field: 'time',
            title: 'Time'
        }, {
            field: 'size',
            title: 'Size'
        }]
    });

    $('#btn-more').click(() => {
        load();
    });
    load();
});

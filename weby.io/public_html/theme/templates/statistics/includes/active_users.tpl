<div class="stat-title-bar">{$title}</div>
<table class="stat-std-grid bordered">
    <thead>
    <tr>
        <th>Current</th>
        <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Total users</td>
        <td>
            {math equation="x + y" x=$active y=$inactive}
        </td>
    </tr>
    <tr>
        <td>Active users</td>
        <td>{$active}
            <span class="small-grayed">
            (<b>{math equation="x / (x + y) * 100" x=$active y=$inactive format="%.2f"}%</b>)
            </span>
        </td>
    </tr>
    <tr>
        <td>Inactive users</td>
        <td>
            {$inactive}
            <span class="small-grayed">
            (<b>{math equation="y / (x + y) * 100" x=$active y=$inactive format="%.2f"}%</b>)
            </span>
        </td>
    </tr>
    </tbody>
</table>


<div class="stat-title-bar">
    Display:
    <select id="periodical-stats-period">
        <option value="week">Week</option>
        <option value="month">Month</option>
    </select>
    <input type="hidden" value="{$event}" id="stat_id"/>
</div>

<div id="chart_div" style="width:100%"></div>

{literal}
<script type="text/javascript">
    function viewReady() {

        var period = $('select#periodical-stats-period');
        var event = $('input#stat_id');

        getChart(period.val(), event.val());

        period.change(function () {
            getChart($(this).val(), event.val());
        })
    }

    function getChart(period, event) {
        var chartDiv = $('div#chart_div');

        $.ajax({
            type: "POST",
            url: '/statistics/ajax_get_' + period + '_stats/?event=' + event,
            success: function (response) {
                if (response.data.length == 0) {
                    chartDiv.empty();
                    chartDiv.append('<div class="sys_msg no-products-selected">' +
                            '<p class="msg info">There is no data for selected period.</p></div>');
                } else {
                    drawChart(period, response.data);
                }
            }
        });
    }
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    function drawChart(period, data) {

        var chartData = [];
        chartData.push(['Day', '{/literal}{$title}{literal}']);
        $.each(data, function (i, e) {
            chartData.push([i, parseInt(e)]);
        });

        data = google.visualization.arrayToDataTable(chartData);

        var options = {
            title: '{/literal}{$title}{literal}',
            height: 350,
            pointSize: 5,
            legend: {position: 'bottom'},
            chartArea: {height: 250, width: 800}
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }


    function ucfirst(str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }
</script>
{/literal}

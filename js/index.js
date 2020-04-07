$(document).ready(function () {
  let dropdown = $('#locality-dropdown');

  dropdown.empty();

  dropdown.append('<option selected="true">Sri Lanka</option>');
  dropdown.prop('selectedIndex', 0);

  const url = 'https://corona.lmao.ninja/countries';

  // Populate dropdown with list of Countries
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      dropdown.append(
        $('<option></option>').attr('value', entry.iso2).text(entry.country)
      );
    });
    $('select').selectize({
      sortField: 'text',
    });
  });
});

let propertyMap = new Map([
  ['country', 'Country'],
  ['cases', 'Cases'],
  ['todayCases', 'Today Cases'],
  ['deaths', 'Deaths'],
  ['todayDeaths', 'Today Deaths'],
  ['recovered', 'Recovered'],
  ['active', 'Active'],
  ['critical', 'Critical'],
  ['casesPerOneMillion', 'Cases per 1 Million'],
  ['deathsPerOneMillion', 'Deaths per 1 Million'],
  ['updated', 'Last updated time'],
  ['tests', 'Tests'],
  ['testsPerOneMillion', 'Tests per 1 Million'],
]);

let iconMap = new Map([
  ['cases', '🔺'],
  ['todayCases', '🗓️'],
  ['deaths', '⚰️'],
  ['todayDeaths', '💀'],
  ['recovered', '💪'],
  ['active', '😷'],
  ['critical', '🤢'],
  ['casesPerOneMillion', '📟'],
  ['deathsPerOneMillion', '🔢'],
  ['tests', '🔬'],
  ['testsPerOneMillion', '1️⃣'],
]);

$.fn.jQuerySimpleCounter = function (options) {
  var settings = $.extend(
    {
      start: 0,
      end: 100,
      easing: 'swing',
      duration: 400,
      complete: '',
    },
    options
  );

  var thisElement = $(this);

  $({ count: settings.start }).animate(
    { count: settings.end },
    {
      duration: settings.duration,
      easing: settings.easing,
      step: function () {
        var mathCount = Math.ceil(this.count);
        thisElement.text(mathCount);
      },
      complete: settings.complete,
    }
  );
};

var getCovidDataForCountry = function (country) {
  fetch('https://corona.lmao.ninja/countries/' + country)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var preTag = document.getElementById('code');
      var country = data.country;
      var countryTitle = country ? '- ' + country : '';
      document.getElementById('pageTitle').innerHTML =
        'Covid 19 Statistics ' + countryTitle;
      document.getElementById('countryFlag').src = data.countryInfo.flag;
      var date = new Date(data.updated);
      delete data.countryInfo;
      delete data.country;
      delete data.updated;
      date =
        date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' ⏱️';

      var content = Object.keys(data).map(function (key, index) {
        var value = key + ': ' + data[key];
        var dataElement =
          '<div class="item wow fadeInUpBig animated animated" data-number="' +
          data[key] +
          '" style="visibility: visible;"><i class=""></i><p id="number' +
          (index + 1) +
          '" class="number">' +
          iconMap.get(key) +
          '<br>' +
          data[key] +
          '</p><span></span><p>' +
          propertyMap.get(key) +
          '</p></div>';
        var htmlId = '#number' + index + 1;
        $(htmlId).jQuerySimpleCounter({ end: data[key], duration: 3000 });
        return dataElement;
      });
      preTag.innerHTML = content.join('');

      updateChartForCountry(country, data);
    });
};

function updateChartForCountry(country, data) {
  var deaths = data.deaths;
  var cases = data.cases;
  var todayCases = data.todayCases;
  var todayDeaths = data.todayDeaths;
  var recovered = data.recovered;
  var active = data.active;

  var chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'light2',
    align: 'center',
    title: {
      text: 'Covid-19 in ' + country,
    },
    data: [
      {
        type: 'column',
        dataPoints: [
          { label: 'Cases', y: cases },
          { label: 'Active', y: active },
          { label: 'Deaths', y: deaths },
          { label: 'Recovered', y: recovered },
          { label: 'Today Cases', y: todayCases },
          { label: 'Today Deaths', y: todayDeaths },
        ],
      },
    ],
  });

  chart.render();
}

$('#locality-dropdown').change(function () {
  var end = this.value;
  var firstDropVal = $('#locality-dropdown').val();
  getCovidDataForCountry(firstDropVal);
  updateChartForCountry(firstDropVal);
});

getCovidDataForCountry('LK');

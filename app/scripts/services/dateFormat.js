(function (document, window, $, undefined){
    (function (){
        return dateFormat = {
            ToString: function(date, timer) {
                let day = null;
                let month = null;
                let year = null;
                let hours = null;
                let minutes = null;
                let format = null;

                if(date !== null){
                    date = new Date(date);
                    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                    year = date.getFullYear();

                    if(!timer) {
                        format = day + '/' + month + '/' + year;
                    } else {
                        hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                        minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                        format = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes; 
                    } 
                }

                return format;
            },

            ToDate: function(dateFormat, timer){
                let day = dateFormat.split('/')[0];
                let month = parseInt(dateFormat.split('/')[1]) - 1;
                let year = dateFormat.split('/')[2].split(' ')[0];
                let hours = timer ? dateFormat.split('/')[2].split(' ')[1].split(':')[0] : null;
                let minutes = timer ? dateFormat.split('/')[2].split(' ')[1].split(':')[1] : null;
                let date = null;

                if(!timer){
                    date = new Date(year,month,day).getTime();
                } else {
                    date = new Date(year,month,day,hours,minutes).getTime(); 
                }
                return date;
            }
        }
    })();
})(document, window, jQuery);
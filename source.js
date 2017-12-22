// ==UserScript==
// @name         Negative målinger + Procent Stining
// @namespace    http://*.batechnic.dk/
// @version      1.1
// @description  Markerer negative målinger på "vis målinger" på alle *.batechnic.dk sider med orange, og procent stigninger over 20% med gul.
// @author       Jonas Storm Nikolajsen
// @match        https://*.batechnic.dk/Measurement/Index/*
// @grant        none
// @updateUrl    https://gist.githubusercontent.com/JimWolff/3dd96db7e052c15d7413/raw/gistfile1.txt
// ==/UserScript==
(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("readystatechange", function() {
            if(url.startsWith("/Measurement/ListPerPrimarySignalAndMeterWithFilter") && this.readyState == 4){
                $(function(){
                    window.setTimeout(function(){
                        var prev = null;
                        $(".datatable td:nth-child(7)").each(function(){
                            var $this = $(this);
                            var curr = $this.text();
                            if (prev !== null)
                            {
                                var numberAfter = parseFloat(curr.replace(".", "").replace(",", ".")); // oldest
                                var numberBefore = parseFloat(prev.replace(".", "").replace(",", ".")); // newest
                                
                                var percent = (((numberBefore / numberAfter)-1) * 100).toFixed(4);
                                if(numberAfter === 0)
                                    percent = 0;
 
                                // make percentage larger than 20 yellow and negative numbers red.
                                var tr = $(this).parent();
                                var col = tr.children().index($this);
                                var tdAbove = tr.prev().children().eq(col);
                                if(percent > 20){
                                    tdAbove.addClass("highlight");
                                } else if(percent < 0){
                                    tdAbove.css("background-color","#ffa500");
                                }
                                //tr.append('<td>'+ percent +'%</td>');
                                tdAbove.text('('+percent+'%) ' + tdAbove.text());
                            }
                            prev = curr;
                        });
                    }, 250);
                });
            }
        }, false);
 
        open.call(this, method, url, async, user, pass);
    };
 
})(XMLHttpRequest.prototype.open);

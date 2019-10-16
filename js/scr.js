var pl = new Audio();
var can_Play_Ogg = !!pl.canPlayType
&& pl.canPlayType('audio/ogg; codecs="vorbis"') != "";
var can_Play_Mp3 = !!pl.canPlayType
&& pl.canPlayType('audio/mpeg; codecs="mp3"') != "";
var play_type ='';
var content_wrap= document.getElementById('content_wrap');

if (can_Play_Mp3) play_type='mp3';
else if (can_Play_Ogg) play_type='ogg' ;

try { gl = canvas.getContext("webgl"); }
catch (x) { gl = null; }

if (gl == null) {
    try { gl = canvas.getContext("experimental-webgl"); experimental = true; }
    catch (x) { gl = null; }
}


if (gl) 
{
    console.log('Yeap, we have 3d');
    document.getElementById('image_cover').remove();
    document.getElementById('d3_cover').style.visibility='visible';   
    var threejs = document.createElement('script');
    threejs.src='js/three.min.js';
    threejs.async = false;
    content_wrap.appendChild(threejs);
    var GLTFjs = document.createElement('script');
    GLTFjs.src='js/GLTFLoader.js';
    GLTFjs.async = false;
    content_wrap.appendChild(GLTFjs);
    var BGjs = document.createElement('script');
    BGjs.async = false;
    BGjs.src='js/bg.js'; 
    content_wrap.appendChild(BGjs);
}
else
{
    document.getElementById('d3_cover').remove();
}

if (can_Play_Ogg||can_Play_Mp3)
{
        track_list =
    [
        ['1. ja','00:28'],
        ['2. by','01:51'],
        ['3. ggiiii_8','04:39'],
        ['4. LS21','02:09'],
        ['5. qweqweqw_51','01:23'],
        ['6. sutk_7','04:23'],
        ['7. untitl1111ed_2','01:52'],
        ['8. pills','04:08'],
        ['9. afed_4','05:02'],
        ['10. sd_6','08:51'],
        ['11. sd_6_2','04:08'],
        ['12. wdpk_4','03:29'],
        ['13. wdwsn','01:43'],
        ['14. disco_finale_2','02:39'],
        ['15. 55titled_3','03:55'],
    ];
    var cur_track = -1;
    var cur_time = document.getElementById('curTime');
    var progress_bar = document.getElementById('progress_bar');
    var cur_progress = document.getElementById('progress');
    var cur_buffered = document.getElementById('buffered');
    var chk=0;


    function setTrack(id)
    {  
        paused=pl.paused;
        pl.setAttribute('src', '/media/'+play_type+'/'+track_list[id][0]+'.'+play_type);
        cur_track = id;
        if (!paused) pl.play();
        trackSelect(id);
        cur_progress.style.width=0;
    }

    function nextTrack()
    {
        if (cur_track< Object.keys(track_list).length)
        {
            cur_track++;
            setTrack(cur_track);
        }
    }

    function prevTrack()
    {
        if (cur_track >0)
        {
            cur_track--;
            setTrack(cur_track);
        }
    }

    function to2o(n)
    {
        var m=String(n);
        if (!m.length) m = "00";
        else if (m.length==1) m ="0"+m;
        return m;
    }

    function playPause()
    {
        if (cur_track<0)
        {
            setTrack(0);
            pl.play;
        }
        if (pl.paused)pl.play() 
        else pl.pause();
    }

    function mathTime(sec)
    {
        var m = Math.floor(sec/60);
        sec=Math.floor(sec)-m*60;
        return String(to2o(m))+':'+String(to2o(sec));
    }

    pl.addEventListener('ended',function()
    {
        if(cur_track==16) 
        {
            pl.pause();
            setTrack(0);
        }
        else
        {
            nextTrack();
            pl.play();
        }
        document.getElementById("play").setAttribute('play','true');
    });

    pl.addEventListener('timeupdate',function()
    {
        cur_time.textContent = mathTime(pl.currentTime);
        var progress = pl.currentTime/pl.duration;
        trackCheck(progress);
        total_width = parseInt(window.getComputedStyle(progress_bar).width);
        cur_progress.style.width=Math.floor(progress*total_width)+'px';
    });

    pl.addEventListener('canplay',function(){
        document.getElementById('totalTime').innerText='/ '+mathTime(pl.duration); 
    })

    progress_bar.addEventListener('mouseup',function(e)
    {
            var total_width = parseInt(window.getComputedStyle(this).width)
            console.log(this.offsetWidth);
            var rect = this.getBoundingClientRect();
            var x = (e.pageX-rect.left)/total_width; 
            pl.currentTime=x*pl.duration;
    })

    function writeTrackList()
    {
        var list ='';
        track_list.forEach(function(item, i, arr)
            {
                list+="<div class='track' trackid='"+i+"'><div class='track_name'>"+item[0]+"</div><div class='track_time'>"+item[1]+"</div></div>";
            }
        )
        document.getElementById('track_list').innerHTML=list;
    }
    writeTrackList();

    function trackCheck(n)
    {
        if (n>0.9&& cur_track==14&& chk==0) 
        {
            track_list.push(['16. 5minuteofsilence','05:00']); document.getElementById('track_list').innerHTML+="<div trackid='15' class='track'><div class='track_name'>"+track_list[15][0]+"</div><div class='track_time'>"+track_list[15][1]+"</div></div>";
            chk++;
        }
            if (n>0.9&& cur_track==15&& chk==1) {track_list.push(['17. hidden','00:51']); document.getElementById('track_list').innerHTML+="<div trackid='16' class='track'><div class='track_name'>"+track_list[16][0]+"</div><div class='track_time'>"+track_list[16][1]+"</div></div>";
            chk++;
        }
    }

    document.getElementById('track_list').addEventListener('click',function(e){
        if (e.target.parentElement.hasAttribute('trackid') )
        {
            if(cur_track!=e.target.parentElement.attributes.trackid.value)
            {
                setTrack(e.target.parentElement.attributes.trackid.value);
                pl.play();
            }
        }
    })

    function trackSelect(id)
    {
        var arr=document.querySelector("div[id=track_list] div[class=track_p]");
        if (arr!=null) arr.setAttribute('class',"track");
        document.querySelector("div[id=track_list] div[trackid='"+id+"']").setAttribute("class","track_p");
    }

    function changePlayButton()
    {
        if (!pl.paused)
        {
            document.getElementById("play").setAttribute('play','false');
        }
        else
        {
            document.getElementById("play").setAttribute('play','true');
        }
    }

    pl.addEventListener('playing',function()
    {
        document.getElementById("play").setAttribute('play','false');
    })

    pl.addEventListener('pause',function()
    {
        document.getElementById("play").setAttribute('play','true');
    })

}
else getLostGrandpa();

function getLostGrandpa()
{
    document.getElementById('content_wrap').innerHTML='Get lost, grandpa. Your browser too old or too stupid, to play music, and i too lazy, to support old technologies. You still can grab this filthy album here (Zip archive full of mp3 files), after that go away.'
}

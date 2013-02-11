<?
function getJs($folder = "app", $compiled = true)
{
 //   $str = "<script src='" . $file . "'></script>\n";
    $files = array();
    if($compiled){
        array_push($files, JsUtils::getJsBuild($folder));
    }else{
        $files = JsUtils::getJsSource($folder);
    }
    $str="";
    foreach($files as $f){
        if($f)
        $str .= "<script src='" . $f . "'></script>\n";
    }

    return $str;
}
class JsUtils
    {

        public static $projectname = "xylo";
        public static $sitepath = './';
        public static $buildpath = "assets/js/build/";
        public static $srcpath = '../src/js/';
        public static $useCompiled = true;
        //JsUtils::$useCompiled


        public static function setDevMode($devmode){

            if(isset($_REQUEST['dev_mode'])){
                $devmode = $_REQUEST['dev_mode'];
            }
            JsUtils::$useCompiled = !$devmode;
        }
        public static function getJsBuild($folder){
            $file = JsUtils::$sitepath.JsUtils::$buildpath.JsUtils::$projectname.'.'.$folder.'.min.js';
            return $file;
        }
        public static function getJsSource($folder, $manifest='manifest.txt')
        {
            $path = JsUtils::$sitepath.JsUtils::$srcpath.$folder.'/';


            $lines = file($path.$manifest, FILE_IGNORE_NEW_LINES);

            $files = array();
            foreach($lines as $l){
                if($l)
                array_push($files, $path.$l);
            }


            return $files;
        }
    }
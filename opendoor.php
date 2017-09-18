<?php
// 小程序APPID
$appid = 'wx1aab1da9038b2c90';
// 小程序密钥
$secret = '469baae4738822f3363a360675f6deb3';

if (is_file(__DIR__.'/config.php')) {
    include __DIR__.'/config.php';
}

// openid 白名单
$allows = file(__DIR__ . '/opendoor.allow');
$allows = array_map($allows, function($item){
    return trim($item);
});

$session_data = [
    'openid' => null,
];
if (isset($_POST['action']) && $_POST['action'] == 'login') {
    $wxcode = $_POST['code'];
    $url = 'https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$secret.'&js_code='.$wxcode.'&grant_type=authorization_code';
    $session_data = json_decode(file_get_contents($url), true);
    if (!isset($session_data['openid'])) {
        $session_data = [
            'openid' => null,
        ];
    }
}

if (isset($_POST['userdata']) && $_POST['userdata']) {
    $session_data['openid'] = json_decode($_POST['userdata'], true)['openid'];
}

$loadavg = explode(" ", file_get_contents('/proc/loadavg'));
$wendus = explode(" ", file_get_contents('/home/pi/bin/wendu.dat'));
$result = [
    'wendu' => trim($wendus[0]) . '°',
    'shidu' => trim($wendus[1]) . '%',
    'loadavg' => trim($loadavg[0]),
    "datetime" => date('Y-m-d H:i:s'),
    'openid' => trim($session_data['openid']),
    'action_tip' => '',
];

if (isset($_POST['openthedoor']) && $_POST['openthedoor'] == 'ON') {
    function opendoor() {
        $file = "/home/pi/bin/menling_php.dat";
        $value = trim(file_get_contents($file));
        file_put_contents("/home/pi/bin/menling_php.dat", $value == 1 ? "0" : "1");
        $result['openthedoor'] = $value == 1 ? "0" : "1";
    }
    if (empty($allows)) {
        opendoor();
        $result['action_tip'] = '开门成功';
    } elseif (in_array($result['openid'], $allows)) {
        opendoor();
        $result['action_tip'] = '开门成功';
    } else {
        $result['action_tip'] = '没权限开门';
    }
    sleep(1);
}

echo json_encode($result);
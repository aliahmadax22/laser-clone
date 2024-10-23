import {
  FabricImage,
  loadSVGFromString,
  util,
  type Canvas,
  type FabricObject,
} from "fabric";
import CustomTextbox from "../artwork-upload-mode/helpers/addText";
import { addToCanvas } from "../artwork-upload-mode/addToCanvas";
import CustomLine from "../artwork-upload-mode/helpers/customPerforationLine";
import CustomQrCode from "../artwork-upload-mode/helpers/customQrCode";

const svgString = `
  <svg
   version="1.1"
   id="svg2708"
   width="985.08209"
   height="1903.2102"
   viewBox="0 0 985.08209 1903.2102"
   sodipodi:docname="vv2.svg"
   inkscape:version="1.2.2 (732a01da63, 2022-12-09, custom)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs2712" />
  <sodipodi:namedview
     id="namedview2710"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     showgrid="false"
     inkscape:zoom="0.39130435"
     inkscape:cx="483"
     inkscape:cy="991.55556"
     inkscape:window-width="1920"
     inkscape:window-height="1031"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1" />
  <g
     inkscape:groupmode="layer"
     id="layer1"
     inkscape:label="Layer 1"
     transform="translate(-25.364424,-65.973108)">
    <path
       style="fill:#000000;stroke-width:1.33333"
       d="m 419.33333,1967.8553 c -49.05664,-7.0692 -94.30816,-39.7005 -116.83597,-84.2514 -10.31528,-20.3995 -17.14612,-47.3147 -17.15867,-67.6092 l -0.005,-8.672 -14.04411,-3.5975 c -54.84986,-14.0497 -98.77016,-58.2512 -112.47936,-113.1996 -8.2335,-33.0011 -5.86277,-66.0019 7.05222,-98.1669 l 4.57393,-11.3916 -4.21801,-3.3711 c -8.07414,-6.4531 -21.86036,-21.5604 -28.68902,-31.4384 -26.99557,-39.0505 -35.04996,-87.5872 -22.01664,-132.6749 3.85245,-13.3274 12.63355,-32.5138 19.63556,-42.9034 l 4.88348,-7.246 -3.01569,-1.199 c -1.65865,-0.6596 -9.61572,-4.3175 -17.68239,-8.1287 -70.980213,-33.5353 -105.667733,-115.5949 -80.552027,-190.5603 8.18615,-24.434 21.716338,-45.4515 41.168118,-63.9496 l 11.045826,-10.5042 -4.497623,-3.3617 c -9.305096,-6.955 -27.499852,-26.7176 -35.060149,-38.0812 -21.55799,-32.403 -30.32958,-72.76367 -24.126132,-111.01133 11.501753,-70.91462 68.93401,-124.36708 141.005087,-131.23408 11.91877,-1.13564 24.44173,-0.64151 44.0822,1.73937 1.8681,0.22647 3.34878,-2.21583 6.69474,-11.04256 23.9272,-63.12073 85.99394,-104.01516 153.09774,-100.87279 47.247,2.21251 90.07084,24.81548 118.66297,62.63183 15.33675,20.28457 27.51228,50.73932 30.26665,75.70613 1.05335,9.54795 1.14343,9.73836 2.7761,5.86816 3.60146,-8.53717 14.76365,-55.82748 18.56812,-78.66666 6.69208,-40.17423 7.5387,-52.0041 7.49061,-104.66667 -0.0391,-42.79936 -0.4044,-51.31901 -3.03012,-70.66667 -10.57348,-77.9109 -28.32801,-123.50153 -57.45053,-147.52313 -4.8131,-3.97008 -13.67098,-9.73756 -19.68416,-12.81664 -13.36103,-6.84157 -8.90675,-8.03521 -56.06699,15.02461 -97.3384,47.59534 -188.22105,107.29631 -267.51293,175.72974 -7.95071,6.86192 -16.14315,13.06442 -18.20541,13.78333 -10.46916,3.64956 -25.09978,-7.49935 -33.707617,-25.68609 -13.832006,-29.22443 -22.574116,-75.74528 -22.64635,-120.51182 -0.0608,-37.6823 3.825128,-54.43389 15.485546,-66.75556 6.794954,-7.1803 7.398409,-7.47796 60.863001,-30.02098 189.20311,-79.77635 330.03271,-141.55078 626.68183,-274.89182 33.37501,-15.001761 66.07501,-29.427971 72.66666,-32.058249 50.20386,-20.032893 86.82019,-18.082228 121.44388,6.469691 21.43006,15.196218 36.4851,40.183598 40.7537,67.640378 1.2592,8.09938 1.2134,10.84001 -0.2393,14.34725 -2.2068,5.32772 -5.1051,6.71965 -63.30677,30.40416 -67.38313,27.42076 -121.21055,47.85251 -216.66667,82.24204 -64.6867,23.30437 -109.71564,41.86496 -144.11797,59.40432 -25.71161,13.10856 -30.54869,17.94607 -30.54869,30.55135 0,8.8302 4.16197,18.76942 23.32498,55.7025 17.26134,33.26798 26.67888,52.89771 39.21347,81.7358 7.77716,17.89275 16.00716,31.41934 23.92655,39.32496 33.4552,33.397 89.66186,18.14015 113.99182,-30.94217 9.80147,-19.77312 12.94238,-35.079 16.20622,-78.97415 2.48526,-33.42402 4.6698,-47.11545 10.13285,-63.50701 10.32828,-30.98936 31.81503,-55.32044 61.87077,-70.06095 19.2903,-9.46072 32.85807,-12.4671 56,-12.40865 22.26794,0.0563 33.58043,2.60075 52,11.69625 27.66227,13.65951 47.2095,37.71591 53.45434,65.78526 2.9573,13.29262 2.0544,33.61229 -2.0283,45.64892 -11.43897,33.72372 -42.72988,58.17018 -80.49845,62.89056 -23.90689,2.9879 -35.59425,-1.39282 -35.59425,-13.34164 0,-4.33484 0.80168,-6.02447 4.31888,-9.10256 12.96554,-11.34688 22.12669,-21.84971 26.68872,-30.5974 11.77014,-22.56924 11.15925,-43.51232 -1.58194,-54.23332 -13.6085,-11.45082 -37.63002,-6.64476 -53.48253,10.70041 -15.42713,16.87975 -23.43328,39.01796 -28.58037,79.02911 -7.48346,58.173 -14.18895,82.65421 -29.81758,108.8615 -19.21933,32.22851 -44.17669,52.20836 -78.21301,62.6142 -11.08136,3.38788 -13.73201,3.66838 -34.66551,3.66838 -20.77144,0 -23.6387,-0.29768 -34.29217,-3.56019 -13.44627,-4.11777 -25.49307,-9.60448 -35.2154,-16.03883 l -6.84091,-4.52738 -0.71865,71.48524 c -0.63307,62.97102 -1.64091,90.53212 -4.23435,115.79442 l -0.71613,6.97583 11.3566,-7.4026 c 79.74753,-51.98207 184.79596,-22.97049 226.716,62.61291 24.15147,49.3073 20.01613,109.26845 -10.725,155.50969 -12.39195,18.6402 -33.48757,38.0888 -53.59099,49.4069 -4.25645,2.3963 -7.94129,4.5113 -8.18853,4.6999 -0.24725,0.1885 3.82743,5.6299 9.05483,12.0919 23.66997,29.2601 34.22045,56.8554 35.66898,93.2939 0.88158,22.1761 -0.76566,35.7108 -6.55208,53.8357 -10.04518,31.4648 -29.71413,59.1672 -55.82381,78.6242 l -10.10161,7.5277 4.45592,6.5907 c 2.45076,3.6249 6.81853,11.3908 9.70618,17.2574 29.39884,59.728 17.95286,131.4623 -28.50193,178.6274 -15.68352,15.9232 -33.73059,28.1974 -52.12361,35.4504 -4.4,1.735 -8.20799,3.2853 -8.46219,3.445 -0.2542,0.1598 1.1572,4.3383 3.13645,9.2856 9.47051,23.6726 13.37543,53.8728 10.11556,78.2327 -6.80425,50.8459 -38.7399,96.6029 -83.12316,119.0976 -9.9793,5.0579 -9.94861,4.9816 -6.92334,17.1947 2.8686,11.5806 3.90662,37.8077 2.0465,51.7077 -10.57938,79.0563 -78.08584,137.7935 -157.21964,136.7964 -7.09693,-0.089 -16.50352,-0.6815 -20.90352,-1.3155 z"
       id="path3189" />
    <path
       style="fill:#ac9393;stroke-width:1.33333"
       d="m 567.28013,824.70999 c 4.37074,-1.12383 8.98534,-2.04332 10.25464,-2.04332 1.26932,0 2.71455,-0.65806 3.21163,-1.46234 1.17763,-1.90545 4.06289,-37.32365 5.86024,-71.93777 1.60752,-30.95831 1.90885,-113.03632 0.5562,-151.50099 l -0.89912,-25.56774 4.09891,-4.09892 C 593.44924,565.01229 595.66959,564 599.35307,564 c 4.3918,0 6.07094,1.20237 16.4359,11.76912 6.3494,6.47303 14.40663,13.71028 17.90495,16.08281 29.83357,20.2328 68.97713,23.1875 101.63941,7.67211 18.96931,-9.01091 37.65695,-27.85115 48.72235,-49.12024 11.52504,-22.1526 16.74004,-41.43365 21.92732,-81.07047 5.54329,-42.35709 9.19523,-57.9661 17.97425,-76.8251 6.96416,-14.96031 14.3411,-25.37939 24.67082,-34.8447 27.95689,-25.61742 66.41502,-27.10749 88.79829,-3.44049 19.12477,20.22164 20.34552,52.61892 3.16931,84.11029 -2.49987,4.58334 -3.89055,8.33334 -3.09042,8.33334 0.80015,0 4.94424,-1.85986 9.20911,-4.133 11.16264,-5.94963 21.71308,-16.99546 27.58887,-28.8843 4.36509,-8.83218 4.98104,-11.34561 5.45912,-22.27644 1.41136,-32.26941 -18.21278,-58.22637 -52.52146,-69.47044 -10.67214,-3.49761 -13.63673,-3.89501 -28.57422,-3.83036 -29.44736,0.12747 -50.63335,8.7646 -70.11887,28.58619 -20.61889,20.97449 -26.56432,39.50869 -31.21081,97.29624 -2.88483,35.87796 -5.55595,51.82291 -11.3991,68.04544 -11.65118,32.3476 -32.77446,57.02029 -59.93789,70.00945 -14.80941,7.08166 -24.50203,9.16766 -42.66667,9.18254 -14.063,0.012 -17.29133,-0.43516 -26.66666,-3.6896 -30.86574,-10.71435 -46.4745,-28.51147 -67.38784,-76.83572 -10.28446,-23.76419 -35.5892,-74.61223 -46.77951,-94 -9.94915,-17.23743 -17.89391,-34.48447 -21.18965,-46 -3.55638,-12.42615 -4.98426,-37.42216 -2.75111,-48.15962 3.26521,-15.69977 16.69279,-36.62678 26.88195,-41.89581 9.31252,-4.81568 19.89282,0.81835 19.89282,10.59296 0,3.92168 -1.37141,6.25596 -7.9225,13.48483 C 549.80521,313.08152 544,324.34107 544,330.70012 c 0,2.33963 0.70124,2.15164 7,-1.87643 10.88353,-6.96004 48.17659,-25.26782 73.44053,-36.05318 29.65114,-12.65827 56.29158,-22.81746 120.8928,-46.10182 79.42088,-28.62584 158.69358,-59.18425 219.33334,-84.54962 L 982,154.8686 l -0.36824,-4.32092 c -0.40512,-4.7538 -3.97285,-13.47391 -9.08128,-22.1961 l -3.30816,-5.64841 -8.95449,6.50214 c -13.53678,9.82948 -32.60732,21.11988 -48.99007,29.00374 -14.85087,7.14668 -42.19009,18.00972 -43.08164,17.11818 -1.16209,-1.1621 1.76409,-3.44203 10.79024,-8.40716 20.93516,-11.51612 47.20956,-30.17388 66.86483,-47.48154 l 10.53785,-9.27922 -4.48748,-3.74632 c -2.46812,-2.06048 -5.33896,-3.74632 -6.37963,-3.74632 -1.04068,0 -7.18005,3.02604 -13.64308,6.72454 -15.67786,8.97176 -36.57998,18.72519 -51.00509,23.8002 C 867.73133,137.8222 868,137.75925 868,136.21191 c 0,-0.61679 3.15,-2.8218 7,-4.90004 16.34295,-8.82194 52.90023,-33.321873 52.97187,-35.500659 0.10453,-3.177402 -21.67411,-4.372795 -35.61436,-1.954819 C 870.01468,97.73182 872.76708,96.588405 714,167.95023 494.63405,266.54972 301.9838,350.75524 139,419.27703 c -8.25,3.46846 -15,6.62924 -15,7.02393 0,0.39469 1.18047,2.62765 2.62327,4.96216 4.17295,6.75197 11.51956,26.95955 14.81017,40.73688 1.66393,6.96667 3.192,12.88655 3.39569,13.15529 0.56946,0.75132 21.10022,-11.30337 34.5042,-20.25924 15.95443,-10.65993 31.0453,-22.16357 43.74575,-33.34698 5.72683,-5.04278 10.76157,-8.81954 11.18831,-8.39279 1.26952,1.26952 -9.94427,14.9736 -25.60072,31.28597 -15.00602,15.6347 -34.06419,32.02258 -50.66667,43.56763 -5.13333,3.56963 -9.55067,6.64503 -9.81629,6.83424 -0.26563,0.18921 0.0344,2.46464 0.66666,5.05652 l 1.14963,4.71251 16.42733,-6.6146 c 36.69376,-14.77502 78.3542,-39.44944 106.12664,-62.85615 19.83199,-16.71447 20.85951,-17.50669 21.66354,-16.70267 1.28942,1.28942 -15.5245,20.96016 -31.53546,36.8936 C 235.81164,492.07367 210.97299,509.7114 175,527.59567 l -23,11.43465 v 18.46961 18.46962 l 18.95336,-14.90843 C 252.13125,497.20781 349.91665,437.94315 440,398.00039 c 16.15777,-7.16432 18.07584,-7.21046 33.46277,-0.80487 35.71238,14.86711 63.19472,46.39244 79.15919,90.80448 8.2412,22.92643 16.82763,63.17431 21.47609,100.66667 2.90479,23.42869 4.0306,88.61236 1.99278,115.38096 -2.8989,38.0797 -9.2967,77.94625 -17.91835,111.65458 -2.76863,10.82454 -2.89365,12.28662 -1.00139,11.70999 1.18923,-0.36239 5.7383,-1.57839 10.10904,-2.70221 z"
       id="path3244" />
    <path
       style="fill:#ac9393;stroke-width:1.33333"
       d="m 124.20035,593 c 2.83413,-11.02373 2.40792,-64.34895 -0.66338,-83 -5.86807,-35.63484 -17.54357,-72.21341 -22.14254,-69.37109 -4.391117,2.71385 -6.18677,51.85168 -2.876113,78.70442 2.343773,19.01038 7.584553,43.83967 11.996823,56.8375 4.42337,13.03053 9.33212,23.82917 10.83204,23.82917 0.57943,0 1.86336,-3.15 2.85317,-7 z"
       id="path3248" />
    <path
       style="fill:#000000;stroke-width:1.33333"
       d="m 598.70096,292.42319 c 0.0377,-1.20023 174.48464,-94.3723 175.2132,-93.58139 0.24904,0.27035 0.68989,4.84259 0.97969,10.16053 l 0.52691,9.66899 -85.51951,36.51391 c -90.35018,38.57645 -91.25402,38.94549 -91.20029,37.23796 z"
       id="path3246" />
    <g
       id="layer2"
       inkscape:label="01"
       transform="translate(25.364424,65.973108)"
       style="display:inline">
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="M 495.18444,849.62616 C 494.62468,790.87748 453.84195,739.14387 397.19133,725.32017 331.70515,709.34047 264.40999,745.438 242.85873,808.10515 l -2.55809,7.43849 10.80887,5.22817 c 12.06229,5.83446 28.05472,16.73098 36.37557,24.78468 l 5.48509,5.30898 6.8955,-4.24284 c 35.29568,-21.71764 86.41944,-27.2982 127.47929,-13.91536 19.33397,6.30161 37.93644,16.86434 54.75627,31.09133 7.86048,6.64876 7.9117,6.66848 10.56544,4.06744 2.38569,-2.33832 2.65097,-4.2602 2.51777,-18.23988 z"
         id="path3242"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 763.51728,1045.317 c 36.34148,-17.6144 62.08255,-50.45727 70.526,-89.98367 3.02336,-14.15325 3.02336,-39.18008 0,-53.33333 -6.46663,-30.27231 -24.26787,-58.43572 -48.62852,-76.93536 -11.30027,-8.58151 -32.37421,-18.79725 -46.74809,-22.66147 -15.94659,-4.28701 -48.73448,-4.2628 -64.66667,0.0477 -10.28873,2.78368 -34.51359,13.70192 -40,18.02816 -2.65155,2.09084 -2.65051,2.103 0.18417,2.14517 5.2708,0.0784 26.37448,6.84259 37.25274,11.94031 28.65566,13.42849 54.42113,37.16072 69.97057,64.44894 24.85292,43.61519 27.35249,97.67394 6.56716,142.02875 -2.91939,6.2298 -5.30797,11.6089 -5.30797,11.9535 0,1.4679 8.24188,-1.5674 20.85061,-7.6788 z"
         id="path3240"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 194.28167,1090.6423 c 18.43028,-1.8914 37.30454,-7.6508 50.78788,-15.4978 l 5.73621,-3.3384 -2.79209,-4.2364 c -1.53564,-2.33 -5.38178,-9.3364 -8.54696,-15.5697 -29.42496,-57.94797 -19.75878,-127.64043 24.43916,-176.20429 l 8.07345,-8.87096 -4.95675,-4.35207 c -31.02226,-27.23792 -77.4245,-37.93869 -118.16145,-27.24911 -21.84866,5.7332 -44.83594,19.32188 -60.395668,35.70223 -11.226125,11.81819 -15.859069,18.37367 -22.889283,32.38767 -29.330253,58.46677 -9.886293,130.03803 45.293721,166.72163 16.15504,10.7399 37.34966,18.362 56.76602,20.4146 5.70025,0.6026 11.05052,1.1754 11.88949,1.2729 0.83896,0.098 7.47928,-0.4336 14.75627,-1.1803 z"
         id="path3238"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 638,1102.7299 c 69.56121,-18.4192 111.45168,-89.8724 93.3346,-159.20211 -10.15512,-38.86126 -40.69885,-73.23843 -78.19669,-88.01092 -16.62899,-6.5511 -25.57331,-8.06747 -47.80458,-8.10455 -24.80824,-0.0413 -35.84514,2.40413 -56.85061,12.59671 -80.07861,38.85686 -97.99985,144.83607 -35.19113,208.10657 19.82057,19.9663 45.65005,33.1118 74.04174,37.6825 9.71928,1.5647 40.12364,-0.2765 50.66667,-3.0682 z"
         id="path3236"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 410.6086,1108.0248 c 21.57893,-5.3254 44.95097,-18.5077 59.88065,-33.7739 l 7.15592,-7.3172 -3.97865,-5.8002 c -9.68808,-14.1235 -19.06915,-37.9633 -22.35632,-56.8132 -2.52731,-14.49275 -2.53544,-40.78611 -0.0171,-55.14565 2.63156,-15.00472 8.64476,-32.29697 16.10072,-46.30106 l 6.14419,-11.54026 -6.43571,-5.69798 c -15.52686,-13.74707 -35.3115,-24.46406 -55.19146,-29.89622 -9.71954,-2.65584 -14.22739,-3.0596 -33.24423,-2.97761 -26.16269,0.1128 -35.78447,2.23749 -56.66667,12.51319 -29.27202,14.40416 -49.60926,35.97154 -62.8935,66.6978 -13.50432,31.2353 -12.86036,72.42459 1.62237,103.77059 18.26157,39.5248 56.005,68.1659 98.65636,74.864 12.27564,1.9278 38.25496,0.6181 51.22337,-2.5823 z"
         id="path3234"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 688.21604,1310.1124 c 25.782,-4.974 48.24332,-17.0047 67.21256,-36.0003 17.57333,-17.5978 28.20035,-36.0064 34.70175,-60.1121 3.92706,-14.5606 3.63993,-50.8118 -0.51747,-65.3333 -6.57349,-22.9608 -24.26851,-51.7084 -39.01907,-63.3911 -4.81028,-3.8098 -5.9796,-4.1639 -10.98846,-3.3274 -3.08295,0.5149 -9.07964,1.445 -13.326,2.067 -6.88031,1.0078 -8.6218,1.9657 -16,8.8011 -32.62662,30.2265 -81.4008,45.4231 -125.61268,39.1372 -8.72111,-1.2399 -26.57338,-5.3889 -31.77386,-7.3846 -1.70134,-0.6528 -1.09462,1.1513 2.33428,6.9412 6.07258,10.2538 12.04382,25.4151 15.76832,40.0367 2.60544,10.2284 2.99703,15.1355 2.96216,37.1199 -0.0413,26.0303 -1.13233,33.3218 -7.82377,52.2874 l -1.97052,5.5851 7.36372,7.4823 c 17.61984,17.9036 40.78092,30.5417 65.80633,35.9081 11.44184,2.4535 38.60704,2.5511 50.88271,0.1828 z"
         id="path3232"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 434,1337.1947 c 42.49964,-5.1865 80.5984,-31.5859 99.85947,-69.1947 10.77236,-21.0339 14.59993,-37.2773 14.45248,-61.3333 -0.0817,-13.3428 -0.78811,-19.3258 -3.54164,-30 -3.95666,-15.3383 -11.64663,-32.2182 -20.0293,-43.9655 -6.82261,-9.561 -27.48482,-29.6002 -34.24668,-33.2141 l -4.70186,-2.5129 -8.56291,6.9082 c -17.95256,14.4836 -38.38829,24.4338 -62.56289,30.4622 -12.02807,2.9994 -16.91095,3.4966 -34.66667,3.5303 -22.25963,0.042 -29.16056,-0.9917 -49.80665,-7.4616 -7.64971,-2.3972 -13.49932,-3.5956 -14,-2.8681 -0.473,0.6873 -2.73094,3.9208 -5.01762,7.1855 -21.0296,30.0247 -28.12973,72.8018 -17.95277,108.1627 14.63147,50.8385 57.53323,87.8219 109.44371,94.3459 12.67742,1.5932 17.97401,1.5858 31.33333,-0.045 z"
         id="path3230"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 213.45744,1340.5912 c 24.63696,-5.0441 46.03441,-16.4991 65.64279,-35.1413 9.64988,-9.1744 9.63165,-9.0438 2.90817,-20.8419 -21.60299,-37.9084 -25.82999,-86.4981 -11.16197,-128.3078 2.24474,-6.3985 6.24313,-15.7715 8.88532,-20.829 l 4.80396,-9.1954 -8.33935,-7.8384 c -4.58665,-4.3111 -11.63013,-10.0234 -15.65219,-12.6939 l -7.31282,-4.8554 -4.94902,2.3914 c -18.61037,8.9926 -42.48086,14.0538 -66.28233,14.0538 -19.86843,0 -34.55264,-2.4258 -52.49985,-8.6728 l -13.60511,-4.7356 -7.73809,5.9543 c -19.648947,15.1195 -35.769535,37.4593 -43.612202,60.4375 -6.047535,17.7186 -7.688795,29.6673 -6.824475,49.6833 1.440099,33.35 13.66241,61.0275 37.45733,84.8224 31.660787,31.6608 74.729647,44.6852 118.279837,35.7688 z"
         id="path3228"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 467.33333,1517.4655 c 25.20008,-6.7232 52.04723,-24.2596 67.97224,-44.399 18.36504,-23.2252 26.89502,-46.0902 28.25282,-75.7332 0.88292,-19.2757 -1.26167,-33.63 -7.63251,-51.0865 -3.85091,-10.5517 -11.72987,-25.1415 -17.08397,-31.6349 l -2.70327,-3.2786 -2.22697,3.1172 c -3.87344,5.4217 -26.49275,23.3148 -37.25216,29.4686 -38.70923,22.1392 -86.18776,26.6702 -128.71699,12.2841 -14.14471,-4.7847 -22.93828,-9.1808 -37.13715,-18.5656 -13.14326,-8.6872 -12.3533,-9.0506 -18.74857,8.6236 -27.45499,75.8756 17.83999,156.5052 97.27653,173.1623 13.05063,2.7365 44.36626,1.6793 58,-1.958 z"
         id="path3226"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 653.33333,1534.7571 c 57.52715,-14.9562 97.29831,-66.4963 97.29831,-126.0904 0,-28.0854 -9.28044,-56.7647 -25.19663,-77.8652 l -2.37672,-3.1509 -10.52914,3.448 c -30.9187,10.125 -67.76047,10.1582 -97.75871,0.088 -12.57335,-4.2207 -28.97615,-12.4199 -39.43711,-19.7132 -11.76681,-8.2038 -12.15594,-8.3769 -9.09622,-4.0476 4.81441,6.8121 12.37928,22.9389 16.42541,35.0158 6.08352,18.1581 8.40544,35.2209 7.56041,55.5582 -1.63909,39.4484 -16.45941,73.8026 -44.73121,103.6891 -8.38141,8.86 -9.04303,7.2955 7.52797,17.8028 11.7417,7.4453 26.4523,13.3315 41.64698,16.6645 15.5867,3.419 42.61349,2.7743 58.66666,-1.3993 z"
         id="path3224"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 288.86875,1584.6699 c 23.10837,-4.4215 42.71504,-13.4818 60.28985,-27.8603 8.785,-7.1872 20.22883,-19.5385 20.12008,-21.7155 -0.03,-0.6017 -2.88005,-2.4222 -6.33333,-4.0454 -19.51726,-9.1743 -43.88566,-30.4251 -57.28416,-49.9555 -18.25924,-26.6156 -28.34236,-58.4896 -28.31999,-89.5231 0.012,-17.2949 4.31251,-40.955 10.26016,-56.4544 0.40192,-1.0474 -3.69872,1.2731 -9.11255,5.1566 -27.6305,19.8205 -56.80334,29.061 -91.74734,29.061 -19.52307,0 -18.55702,-0.5334 -29.87375,16.4984 -21.88736,32.9411 -26.82796,77.4664 -12.84668,115.7762 15.72292,43.0817 52.09495,73.8372 98.14121,82.986 12.4245,2.4686 34.01755,2.5037 46.7065,0.076 z"
         id="path3222"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 564.66667,1750.1255 c 72.95113,-21.1115 112.52409,-96.6883 88.15028,-168.3503 -1.7331,-5.0955 -4.126,-11.1499 -5.31758,-13.4541 l -2.1665,-4.1896 -15.92382,0.8006 c -39.12089,1.9671 -78.43784,-10.6957 -106.91688,-34.4344 l -6.1745,-5.1468 -11.33756,5.7852 c -20.9283,10.679 -46.10632,16.8367 -68.98011,16.8704 l -11.33333,0.017 -5.0974,7.912 c -20.60012,31.975 -25.15534,76.3881 -11.63456,113.4358 15.81034,43.3215 51.48237,73.5762 98.22754,83.3103 14.7,3.0611 43.43208,1.8059 58.50442,-2.556 z"
         id="path3220"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 340.66667,1778.7373 c 14.91412,-3.5986 28.14829,-9.3622 41.53872,-18.0906 12.31945,-8.0302 31.12794,-26.1028 31.12794,-29.91 0,-1.2779 -1.17154,-3.3836 -2.60342,-4.6795 -1.4319,-1.2959 -5.55583,-6.6388 -9.16431,-11.8733 -31.23243,-45.3059 -36.88045,-103.773 -14.75129,-152.7016 2.1188,-4.6848 3.85236,-8.769 3.85236,-9.0759 0,-0.3069 -3.23404,3.254 -7.18676,7.9132 -17.43594,20.5525 -46.66748,38.9967 -74.29587,46.8783 -35.39511,10.0973 -74.78537,7.3856 -106.48388,-7.3304 -10.44104,-4.8474 -10.27479,-4.9804 -15.9464,12.767 -18.49521,57.8747 5.41349,120.4939 57.91291,151.6796 14.72773,8.7486 31.38169,14.5099 49.29604,17.0535 11.55985,1.6415 34.31074,0.3601 46.70396,-2.6303 z"
         id="path3218"
         transform="translate(-25.364424,-65.973108)" />
      <path
         style="fill:#ffcc00;stroke-width:1.33333"
         d="m 464.86875,1940.6699 c 71.94757,-13.7659 118.06648,-80.4522 104.9737,-151.7882 l -2.16298,-11.785 -4.83974,0.9208 c -43.31532,8.2406 -85.80745,-0.013 -120.15889,-23.3412 l -8.06529,-5.4771 -12.42264,12.5037 c -28.0638,28.247 -59.00072,42.414 -102.71946,47.0391 l -7.85986,0.8315 0.8501,12.2133 c 3.51118,50.4432 36.02408,94.5023 82.86964,112.2987 21.41559,8.1356 48.18118,10.6701 69.53542,6.5844 z"
         id="path3216"
         transform="translate(-25.364424,-65.973108)" />
    </g>
  </g>
</svg>`;

const fruits = new URL("@/assets/fruits.jpg", import.meta.url).href;

interface inlinePage {
  pageNumber: number;
  pageID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface cardData {
  cardSide: string;
  cardID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface currentCanvas {
  pageNumber: number;
  pageID: string;
  canvas: Canvas;
}

interface CoverData {
  coverSide: string;
  coverID: string;
  canvas: Canvas;
}

export const addCustomText = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;

      const text = new CustomTextbox(fabricCanvas as Canvas, "My Text");

      addToCanvas(
        text,
        activeCanvas as inlinePage,
        fabricCanvas as Canvas,
        inlinePages,
        modeType
      );
    }
  } else {
    if (modeType === "card" && cardSide === "Front") {
      const text = new CustomTextbox(cardsDataRef[0].canvas, "My Text");

      addToCanvas(text, null, cardsDataRef[0].canvas, inlinePages, modeType);
    } else if (modeType === "card" && cardSide === "Back") {
      const text = new CustomTextbox(cardsDataRef[1].canvas, "My Text");

      addToCanvas(text, null, cardsDataRef[1].canvas, inlinePages, modeType);
    } else {
      const text = new CustomTextbox(activeCover.canvas, "My Text");

      addToCanvas(text, null, activeCover.canvas, inlinePages, modeType);
    }
  }
};

export const addSVGText = async (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      if (cnv) return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;

      loadSVGFromString(svgString).then((resultSVG) => {
        const obj = util.groupSVGElements(
          resultSVG.objects as FabricObject[],
          resultSVG.options
        );
        if (fabricCanvas) {
          obj.set({
            left: 150,
            top: 100,
            scaleX: 0.2,
            scaleY: 0.2,
            originX: "center",
            originY: "center",
          });

          addToCanvas(
            obj,
            activeCanvas as inlinePage,
            fabricCanvas as Canvas,
            inlinePages,
            modeType
          );
        }
      });
    }
  } else if (modeType === "card") {
    loadSVGFromString(svgString).then((resultSVG) => {
      const obj = util.groupSVGElements(
        resultSVG.objects as FabricObject[],
        resultSVG.options
      );

      const canvas =
        cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

      const zoom = canvas.getZoom();
      obj.set({
        left: canvas.width / 2 / zoom,
        top: 100,
        scaleX: 0.2,
        scaleY: 0.2,
        originX: "center",
        originY: "center",
      });

      addToCanvas(obj, null, canvas, inlinePages, modeType);
    });
  } else {
    loadSVGFromString(svgString).then((resultSVG) => {
      const obj = util.groupSVGElements(
        resultSVG.objects as FabricObject[],
        resultSVG.options
      );

      const fabricCanvas = activeCover.canvas;

      const zoom = fabricCanvas.getZoom();
      obj.set({
        left: fabricCanvas.width / 2 / zoom,
        top: 100,
        scaleX: 0.1,
        scaleY: 0.1,
        originX: "center",
        originY: "center",
      });

      addToCanvas(obj, null, fabricCanvas, inlinePages, modeType);
    });
  }
};

export const addImage = async (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      if (cnv) return cnv.pageID === activePageID;
    });

    if (activeCanvas) {
      const fabricCanvas = activeCanvas.canvas;
      const zoom = fabricCanvas.getZoom();

      const imgScale = 0.2;

      FabricImage.fromURL(fruits).then((img) => {
        img.set({
          left: fabricCanvas.width / 2 / zoom,
          top: fabricCanvas.height / 2 / zoom,
          scaleX: imgScale,
          scaleY: imgScale,
          originX: "center",
          originY: "center",
        });

        addToCanvas(
          img,
          activeCanvas as inlinePage,
          fabricCanvas as Canvas,
          inlinePages,
          modeType
        );
      });
    }
  } else if (modeType === "card") {
    FabricImage.fromURL(fruits).then((img) => {
      const imgScale = 0.2;

      const canvas =
        cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

      img.set({
        left: canvas.width / 2 / canvas.getZoom(),

        top: canvas.height / 2 / canvas.getZoom(),
        scaleX: imgScale,
        scaleY: imgScale,
        originX: "center",
        originY: "center",
      });
      addToCanvas(img, null, canvas, inlinePages, modeType);
    });
  } else {
    FabricImage.fromURL(fruits).then((img) => {
      const imgScale = 0.2;

      const fabricCanvas = activeCover.canvas;

      img.set({
        left: fabricCanvas.width / 2 / fabricCanvas.getZoom(),
        top: fabricCanvas.height / 2 / fabricCanvas.getZoom(),
        scaleX: imgScale,
        scaleY: imgScale,
        originX: "center",
        originY: "center",
      });
      addToCanvas(img, null, fabricCanvas, inlinePages, modeType);
    });
  }
};

export const addPerforationLineHorizontal = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  cardSide: string,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[]
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas && activeCanvas.canvas;

    if (activeCanvas && activeCanvas.pageNumber % 2 === 0) {
      const frontLine = new CustomLine(fabricCanvas as Canvas, "horizontal");
      const nextCanvas = inlinePages[activeCanvas.pageNumber];
      const mirroredLine = frontLine.straightLine(nextCanvas.canvas);
      mirroredLine.setCoords();

      fabricCanvas && fabricCanvas.add(frontLine);
      fabricCanvas && fabricCanvas.requestRenderAll();

      nextCanvas.canvas.add(mirroredLine);
      nextCanvas.canvas.requestRenderAll();
    } else {
      const frontLine = new CustomLine(fabricCanvas as Canvas, "horizontal");
      const previousCanvas =
        activeCanvas && inlinePages[activeCanvas.pageNumber - 2];
      if (previousCanvas && previousCanvas.canvas) {
        const mirroredLine = frontLine.straightLine(previousCanvas.canvas);
        mirroredLine.setCoords();

        fabricCanvas && fabricCanvas.add(frontLine);
        fabricCanvas && fabricCanvas.requestRenderAll();

        previousCanvas && previousCanvas.canvas.add(mirroredLine);
        previousCanvas && previousCanvas.canvas.requestRenderAll();
      }
    }
  } else {
    if (cardsDataRef) {
      if (cardSide === "Front" && modeType === "card") {
        const frontLine = new CustomLine(cardsDataRef[0].canvas, "horizontal");
        const straightLine = frontLine.straightLine(cardsDataRef[1].canvas);

        cardsDataRef[0].canvas.add(frontLine);
        cardsDataRef[1].canvas.add(straightLine);
        cardsDataRef[0].canvas.requestRenderAll();
        cardsDataRef[1].canvas.requestRenderAll();
      } else if (cardSide === "Back" && modeType === "card") {
        const backline = new CustomLine(cardsDataRef[1].canvas, "horizontal");
        const straightLine = backline.straightLine(cardsDataRef[0].canvas);

        cardsDataRef[0].canvas.add(straightLine);
        cardsDataRef[1].canvas.add(backline);

        cardsDataRef[0].canvas.requestRenderAll();
        cardsDataRef[1].canvas.requestRenderAll();
      }
    }
  }
};

export const addPerforationLineVertical = (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  cardSide: string,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[]
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas && activeCanvas.canvas;

    if (activeCanvas && activeCanvas.pageNumber % 2 === 0) {
      const frontLine = new CustomLine(fabricCanvas as Canvas, "vertical");
      const nextCanvas = inlinePages[activeCanvas.pageNumber];
      const mirroredLine = frontLine.mirrorLine(nextCanvas.canvas);
      mirroredLine.setCoords();

      fabricCanvas && fabricCanvas.add(frontLine);
      fabricCanvas && fabricCanvas.requestRenderAll();

      nextCanvas.canvas.add(mirroredLine);
      nextCanvas.canvas.requestRenderAll();
    } else {
      const frontLine = new CustomLine(fabricCanvas as Canvas, "vertical");
      const previousCanvas =
        activeCanvas && inlinePages[activeCanvas.pageNumber - 2];
      if (previousCanvas) {
        const mirroredLine = frontLine.mirrorLine(previousCanvas.canvas);
        mirroredLine.setCoords();

        fabricCanvas && fabricCanvas.add(frontLine);
        fabricCanvas && fabricCanvas.requestRenderAll();

        previousCanvas && previousCanvas.canvas.add(mirroredLine);
        previousCanvas && previousCanvas.canvas.requestRenderAll();
      }
    }
  } else {
    if (cardsDataRef) {
      if (cardSide === "Front") {
        const frontLine = new CustomLine(cardsDataRef[0].canvas, "vertical");
        // Card[0].canvasObjects.push(frontLine);
        const mirroredLine = frontLine.mirrorLine(cardsDataRef[1].canvas);
        // frontLine.mirrorLine(cardsDataRef[1].canvas);

        // Card[1].canvasObjects.push(mirroredLine);
        cardsDataRef[0].canvas.add(frontLine);

        cardsDataRef[1].canvas.add(mirroredLine);

        cardsDataRef[0].canvas.requestRenderAll();
        cardsDataRef[1].canvas.requestRenderAll();
      } else if (cardSide === "Back") {
        const backLine = new CustomLine(cardsDataRef[1].canvas, "vertical");
        // Card[1].canvasObjects.push(backLine);
        // Card[0].canvasObjects.push(mirroredLine);
        const mirroredLine = backLine.mirrorLine(cardsDataRef[0].canvas);

        cardsDataRef[1].canvas.add(backLine);

        cardsDataRef[0].canvas.add(mirroredLine);

        cardsDataRef[1].canvas.requestRenderAll();
        cardsDataRef[0].canvas.requestRenderAll();
      }
    }
  }
};

export const generateQRCode = async (
  modeType: string,
  currentCNV: currentCanvas[],
  activePageID: string | null,
  qrText: string,
  inlinePages: inlinePage[],
  cardsDataRef: cardData[],
  cardSide: string,
  activeCover: CoverData
) => {
  if (modeType === "page") {
    const activeCanvas = currentCNV.find((cnv) => {
      return cnv.pageID === activePageID;
    });

    const fabricCanvas = activeCanvas && activeCanvas.canvas;

    if (fabricCanvas) {
      new CustomQrCode(
        qrText,
        fabricCanvas as Canvas,
        inlinePages,
        currentCNV,
        modeType,
        activePageID
      );
    }
  } else if (modeType === "card") {
    const canvas =
      cardSide === "Front" ? cardsDataRef[0].canvas : cardsDataRef[1].canvas;

    new CustomQrCode(
      qrText,
      canvas as Canvas,
      inlinePages,
      currentCNV,
      modeType,
      activePageID
    );
  } else {
    const fabricCanvas = activeCover.canvas;

    if (fabricCanvas) {
      new CustomQrCode(
        qrText,
        fabricCanvas as Canvas,
        inlinePages,
        currentCNV,
        modeType,
        activePageID
      );
    }
  }
};

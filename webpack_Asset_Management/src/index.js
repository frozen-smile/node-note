// import _ from 'lodash';
import './style.css';
import jiaolv from './jiaolv.jpg';
import Data from './data.xml';
import { cube } from './math.js';

function component() {
	var element = document.createElement('div');

	// Lodash, currently included via a script, is required for this line to work
	// Lodash, now imported by this script
	// element.innerHTML = _.join(['Hello', 'webpack'], ' ');

	element.classList.add('hello');
	// 将图像添加到我们现有的 div。
	var myIcon = new Image();
	myIcon.src = jiaolv;
    myIcon.classList.add('img');

    element.innerHTML = [
        'Hello webpack!',
        '5 cubed is equal to ' + cube(5)
        ].join('\n\n');

	element.appendChild(myIcon);
	//打印来自xml的数据
	console.log(Data);
	

	return element;
}

document.body.appendChild(component());
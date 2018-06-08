/**
 * Created by yuanjianxin on 2018/6/7.
 */

module.exports={


    formatNumberByString(str){
        //todo
        let number=0;
        str=str.substr(-4);
        for(let i=0;i<str.length;i++){
            number+=str.charCodeAt(i);
        }
        return number;
    }

};
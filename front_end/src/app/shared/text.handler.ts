/**
 * Created by dispensable on 2016/10/22.
 */
export class TextHandler {
  static genPost(pureText: string) {
    // 根据相关分隔符分割字符
    let textSeq: string[] = pureText.split(/[.\u3002\uff1f\uff01]+/);
    console.log(textSeq);

    // 添加标识符
    for (let sentenceNum in textSeq) {
      textSeq[sentenceNum] += ('^^' + sentenceNum.toString() + '^^')
    }
    console.log(textSeq);
    // 返回生成的特殊文字
    console.log(textSeq.join('.'));
    return textSeq.join('.');
  }

  static postFilter(specialText: string, comments: {[id: number]: string}) {
    // 根据commentsNum数组删除相关标识符
    for (let i in comments) {
      specialText = specialText.replace('^^'+ i.toString() + '^^', ('[' + comments[i].fontcolor("Red") + ']'));
    }
    // 返回过滤后的post
    console.log(specialText);
    specialText = specialText.replace('${[0-9]*} ', '');
    console.log(specialText);
    return specialText;
  }

  static genShowText(pureText: string) {
    let paragraphSeq: string[] = pureText.split(/<\/p>/);
    let sentences: Array<Array<any>> = []; //[[[01], [02], [03] ...], [[11], [12], [13] ...]...]

    let paragrahNum = 0;
    paragraphSeq.pop(); // 删除最后空字符段落

    // 遍历段
    for (let paragraph of paragraphSeq) {
      let sentenceNum = 0;
      paragraph = paragraph.replace(/<p>/, '');  // 删除<p>标签
      let spliter: string[] = paragraph.match(/[.\u3002\uff1f\uff01]+/g); // 记录句子分割符
      let allSentences: string[] = paragraph.split(/[.\u3002\uff1f\uff01]+/); // 分割句子到数组
      // 删除最后一个空字符串
      allSentences.pop();
      // 初始化该段落数组
      sentences.push([]);

      // 遍历段落中的句子
      for (let sentence of allSentences) {
        sentences[paragrahNum].push([sentence + spliter[sentenceNum], paragrahNum, sentenceNum]);
        sentenceNum++;
      }
      paragrahNum++;
    }
    return sentences;
  }

  static addComments(sentences: Array<any>, comments: Array<any>) {
    for (let comment of comments) {
      let paragraphNum = comment[0];
      let sentenceNum = comment[1];
      let commentString = comment[2];
      // comments 格式： [[段落号， 句子号， 评论内容],[]...] 二维数组
      // sentences 格式： [[[句子，段落号， 文本号]， [句子，段落号，文本号]...]] 三维数组
      sentences[paragraphNum][sentenceNum][0] += ('[' + commentString.fontcolor('Red') + ']');
    }
    return sentences;
  }

  testGen() {
    TextHandler.genShowText('this is a test. this is a test. this is a test.这是一个测试啊。这是一个测试？这个一个测试！')
  }
}

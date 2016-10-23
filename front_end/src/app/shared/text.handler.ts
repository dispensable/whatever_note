/**
 * Created by dispensable on 2016/10/22.
 */
import { Comment } from '../shared/comment';

export class TextHandler {
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

  static handleComments(comments: Array<Comment>) {
    let results: Array<any> = [];
    for (let comment of comments) {
      let pNum = comment['p_num'];
      let sNum = comment['s_num'];
      let commentText = comment['content'];
      let up = comment['up'];
      results.push([pNum, sNum, up, commentText]);
    }

    results.sort(TextHandler.compareUpComment);

    let finalResults = [];
    // 在有序结果中仅保存up最多的结果
    let oldP = results[0][0];  // results结构[[p_num, s_num, up, comment],[]...]
    let oldS = results[0][1];
    results[0].splice(2, 1);  // 语法真是奇葩的要死
    finalResults.push(results[0]); // 去掉up数
    for (let comment of results) {
      if (comment[0] !== oldP || comment[1] !== oldS) {
        // 跳到新句子的评论集中时才添加评论到文中（仅选一条最佳）
        oldS = comment[1];
        oldP = comment[0];
        comment.splice(2, 1);
        finalResults.push(comment);
      }
    }
    return finalResults;
  }

  private static compareUpComment(a, b) {
    if (a[0] > b[0]) { return -1;}
    if (a[0] < b[0]) { return 1;}
    if (a[0] === b[0]) {
      if (a[1] > b[1]) {return -1;}
      if (a[1] < b[1]) {return 1;}
      if (a[1] === b[1]) {
        if (a[2] > b[2]) {return -1;}
        if (a[2] < b[2]) {return 1;}
        if (a[2] === b[2]) {
          if (a[3] > b[3]) {return -1;}
          if (a[3] < b[3]) {return 1;}
          if (a[3] === b[3]) {return 0;}
        }
      }
    }
  }

  testGen() {
    let c1 = {'p_num': 1, 's_num': 2, 'content': 'test up2', 'up': 2};
    let c2 = {'p_num': 1, 's_num': 2, 'content': 'test up4', 'up': 4};
    let c3 = {'p_num': 1, 's_num': 2, 'content': 'test up12', 'up': 12};
    let c4 = {'p_num': 2, 's_num': 3, 'content': 'test up2 2,3', 'up': 2};
    let c5 = {'p_num': 2, 's_num': 3, 'content': 'test up3', 'up': 3};
    let comments = [c1, c2, c3, c4, c5];
    console.log(comments);
    TextHandler.handleComments(comments);
  }
}

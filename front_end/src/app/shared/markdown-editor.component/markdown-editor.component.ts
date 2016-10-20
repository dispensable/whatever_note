/**
 * Created by dispensable on 2016/10/19.
 */
import { Component } from '@angular/core';
import * as Showdown from 'Showdown';

import * as Prism from 'PrismJS';

@Component({
  selector: 'editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['../bootstrap.css']
  })

export class MarkdownEditor {
  content: string = '';
  contentHtml: string = '';

  preview() {
    this.contentHtml = this.fromRAW(this.content);
  }

  clear() {
    this.content = '';
    this.contentHtml = '';
  }

  save() {
    localStorage.setItem('article', this.content);
  }

  /**
   * fromRAW
   */
  fromRAW(raw: string) {
    let html = this.process(this.prepare(raw));
    console.log(html);
    this.highlight(html);
    return html;
  }

  /**
   * prepare
   */
  prepare(raw: any) {
    if (raw) {
      raw = raw.split('\n');
      raw[0] = raw[0].trim();
      raw[1] = raw[1].trim();
      raw[2] = raw[2].trim();
      raw[raw.length - 2 ] = raw[raw.length - 2].trim();
      raw[raw.length - 1] = raw[raw.length - 1].trim();
      return raw.join('\n')
    }
      return raw.split('\n').map((line) => line.trim()).join('\n');
  }

  /**
   * process
   */
  process(markdown: string) {
    let converter = new Showdown.Converter();
    return converter.makeHtml(markdown);
  }

  /**
   * highlight
   */
  highlight(html: string) {
    Prism.highlightAll(false);
  }
}

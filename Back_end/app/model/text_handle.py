#!/usr/bin/env python3
# -*-coding:utf-8-*-

import string


def parse_text(lists):
    k = 0
    for num in range(len(lists)):
        lists[num] += (' $' + str(k) + ' ')
        k += 1
    print(lists)
    return lists


if __name__ == '__main__':
    org_text = "this is my sentece. second sentence. third sentence. last sentence."
    lists = org_text.split('.')
    print("lists: {0}".format(lists))

    new = parse_text(lists)
    new_sentence = ''.join(new)
    print(new_sentence)
    form = string.Template(
        """ this is my sentece $test0. second sentence $test1 .
        third sentence $test2 . last sentence $test3 . $test4 """
    )
    print(form)
    print(form.substitute({
        'test0': '/''o comment''/',
        'test1': '1 comment',
        'test2': '2 comments',
        'test3': ' ',
        'test4': 'last test'
    }))


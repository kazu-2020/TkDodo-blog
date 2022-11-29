#!/bin/bash

d=`date -v-7d +'%Y%m%d' `

function printMemberIssue () {
  touch "./1.txt"
  local l=("$@")
  for user in $l; do
      curl -s -H "Authorization: token $ACCESS_TOKEN" \
      "https://api.github.com/search/issues?q=org:d7lab+involves:${user}" \
      | jq -r 'try ( .items?[] | [.updated_at[0:4] + .updated_at[5:7] + .updated_at[8:10], .html_url] | @sh ) catch .' \
      | xargs printf '%s %s\n' > 1.txt

      IFS=$'\n'
      local list=(`cat 1.txt`)
      for v in "${list[@]}"
      do
          IFS=' ' read -r -a array <<< "$v"
          if [[ ${array[0]} -gt $d ]] ; then
              echo -e - ${v:9}
          fi
      done

  done | sort -u | sort -k 5,5 -k 7nr -t "/"
  echo -e "\n"
  echo -e "\n"
}

function printRepoIssue () {
  touch "./2.txt"
  local l=("$@")
  for repo in $l; do
      curl -s -H "Authorization: token $ACCESS_TOKEN" \
      "https://api.github.com/repos/d7lab/${repo}/issues?state=all" \
      | jq -r 'try ( .[]? | [.updated_at[0:4] + .updated_at[5:7] + .updated_at[8:10], .html_url] | @sh ) catch .' \
      | xargs printf '%s %s\n' > 2.txt

      IFS=$'\n'
      local list=(`cat 2.txt`)
      for v in "${list[@]}"
      do
          IFS=' ' read -r -a array <<< "$v"
          if [[ ${array[0]} -gt $d ]] ; then
              echo -e - ${v:9}
          fi
      done

  done | sort -u | sort -k 5,5 -k 7nr -t "/"
  echo -e "\n"
  echo -e "\n"
}

function print_team_nhk () {
  member="TSUTSUI-koji kambekje YuMasubuchi maruyamaygy nakakgo taguchiseq MegumiTsunoya nakaokanfy shimoyamats sugimorikhy ogishimamjy taniguchitic kudoumge oogihhw saitounfq okamotohiw iidatje uranomfw2 KazukoHayashi"
  printMemberIssue "$member"
}

function print_team_sikmi () {
  member="norikt YudaiNoda3576 bornknow108 takami0620 hellnear7 toyokappa ke0ta-kawaguchi"
  printMemberIssue "$member"
}

echo -e "\n## Editorial Hands定例: 本日のアジェンダ"
echo -e "\nEditorial Hands関連のアジェンダです。\n"
echo -e "- [前回までのアジェンダ](https://github.com/d7lab/aw-documents/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Aagenda-editorialhands)"
echo -e "\n今回のアジェンダは、おおよそ下記をイメージしています。\n"
echo -e "- 情報共有"
echo -e "- 各社での検討状況など"
echo -e "\n## 情報共有"
echo -e "\n## 各社での検討状況など"

# sikmi
echo -e "\n### sikmi\n"
print_team_sikmi | grep -e "/d7lab/aw-editorialhands" -e "/d7lab/dot-editorialhands" | grep -v "agenda"

# nhk
echo -e "\n### NHK\n"
print_team_nhk | grep -e "/d7lab/aw-editorialhands" -e "/d7lab/dot-editorialhands" | grep -v "agenda"

# nr-documents
echo -e "\n###  【ご参考】nr-documents\n"
printRepoIssue "nr-documents"

sac
exit 0

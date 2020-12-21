# frozen_string_literal: true

@vpc_config = {
  vpc_id: 'vpc-04ce451b32004288d', # tomigaya-dev-vpc
  subnets: [
    'subnet-0c0798cf0dedcb52b', # tomigaya-dev-nat-a
    'subnet-0134f297a6631ae21', # tomigaya-dev-nat-c
    'subnet-0494f14a1e59651d2' # tomigaya-dev-nat-d
  ],
  security_group_ids: [
    'sg-0aeb9fe5497f55bce' # tomigaya-dev-internal-sg
  ]
}

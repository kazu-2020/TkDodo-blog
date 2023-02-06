# frozen_string_literal: true

module ScimUserResourcable
  extend ActiveSupport::Concern

  module ClassMethods
    # https://github.com/RIPAGlobal/scimitar#data-models
    def scim_resource_type
      Scimitar::Resources::User
    end

    # 最低限必要な情報(https://www.rfc-editor.org/rfc/rfc7643#section-8.1)を定義
    # NOTE: scimitarを利用してユーザー作成する際、このメソッドを用いて必要なカラムを参照するので、email, first_name, last_nameは必須
    # rubocop:disable Metrics/MethodLength
    def scim_attributes_map
      {
        id: :id,
        userName: :man_number,
        name: {
          familyName: :first_name,
          givenName: :last_name
        },
        emails: [
          {
            match: 'primary',
            with: true,
            using: {
              value: :email,
              primary: true
            }
          }
        ]
      }
    end
    # rubocop:enable Metrics/MethodLength

    def scim_mutable_attributes; end

    # filter クエリのサポート
    # NOTE: Okta の設定に合わせる（デフォルトはuserNameでフィルタされる）
    # NOTE: キーが文字列でないとfilter でエラーになる
    def scim_queryable_attributes
      {
        userName: { column: :man_number }
      }.stringify_keys
    end

    def scim_timestamps_map
      {
        created: :created_at,
        lastModified: :updated_at
      }
    end
  end
end

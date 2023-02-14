# frozen_string_literal: true

class Scim::V2::UsersController < Scimitar::ResourcesController
  skip_before_action :verify_authenticity_token

  # @see https://github.com/RIPAGlobal/scimitar
  def index
    pagination_info = scim_pagination_info(query.count)
    page_of_results = query.offset(pagination_info.offset).limit(pagination_info.limit).to_a

    super(pagination_info, page_of_results) do |user|
      user.to_scim(location: url_for(action: :show, id: user.id))
    end
  end

  def show
    super do |user_id|
      user = storage_class.find(user_id)
      user.to_scim(location: url_for(action: :show, id: user_id))
    end
  end

  def create
    super do |scim_resource|
      user = find_user_by_email(scim_resource) || storage_class.new

      user.from_scim!(scim_hash: scim_resource.as_json)
      save!(user)

      logger.info "SCIM: User created or updated. #{user.to_json}"
      user.to_scim(location: url_for(action: :show, id: user.id))
    end
  end

  # NOTE: ユーザーの非アクティブ化時、削除時もこのリクエストが呼ばれる
  # https://developer.okta.com/docs/reference/scim/scim-20/#update-a-specific-user-patch
  # > For any custom app integrations created using the AIW, all SCIM operations that update a User object,
  # > including these operations, are always sent through a PUT method request.
  # https://developer.okta.com/docs/reference/scim/scim-20/#delete-users
  # > For any custom app integrations created using the AIW, this request is sent through a PUT method request.
  def replace
    super do |user_id, scim_resource|
      user = storage_class.find(user_id) # e.g. User.find(123)
      if deactivated?(scim_resource)
        user.destroy!

        logger.info "SCIM: User deleted. #{user.to_json}"
      else
        user.from_scim!(scim_hash: scim_resource.as_json)
        save!(user)

        logger.info "SCIM: User updated. #{user.to_json}"
      end

      user.to_scim(location: url_for(action: :show, id: user.id))
    end
  end

  protected

  # @override
  # see https://github.com/RIPAGlobal/scimitar/blob/fe26bad339863b3b1fbb64112baf39e9b214798c/app/controllers/scimitar/resources_controller.rb#L141
  def storage_class
    User
  end

  private

  def save!(user)
    user.save!
  rescue ActiveRecord::RecordInvalid => e
    raise Scimitar::ResourceInvalidError, e.full_messages.join('; ')
  end

  def find_user_by_email(scim_resource)
    # NOTE: Oktaにはemailを複数登録可能なので、複数emailを検索対象にする
    email_list = scim_resource.as_json.deep_symbolize_keys[:emails].map { |emails| emails[:value] }
    storage_class.find_by_email(email_list)
  end

  def query
    @query ||= if params[:filter].present?
                 attribute_map = storage_class.new.scim_queryable_attributes # Note use of *instance* method
                 parser = Scimitar::Lists::QueryParser.new(attribute_map)

                 parser.parse(params[:filter]).to_activerecord_query(base_scope)
               else
                 base_scope # TODO: Okta が必ずfilterセットするならこの処理いらないかも
               end
  end

  def base_scope
    @base_scope ||= storage_class.all
  end

  def deactivated?(scim_resource)
    resource_hash = scim_resource.as_json.symbolize_keys

    # NOTE: 情報更新だけだと active キーが含まれないので、falseと比較
    resource_hash[:active] == false
  end
end

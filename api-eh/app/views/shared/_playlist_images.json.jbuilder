# frozen_string_literal: true

if playlist.logo_image_url
  json.logo do
    json.main do
      json.url playlist.logo_image.url
      json.width playlist.logo_image.width
      json.height playlist.logo_image.height
    end

    if playlist.logo_image(:medium).present? && playlist.logo_image.storage_key == :store
      json.medium do
        json.url playlist.logo_image(:medium).url
        json.width playlist.logo_image(:medium).width
        json.height playlist.logo_image(:medium).height
      end
    elsif playlist.logo_image(:medium).blank? && playlist.logo_image.storage_key == :cache
      json.medium do
        json.url TMP_LOGO_IMG_UPLOADING
        json.width 640
        json.height 640
      end
    end

    if playlist.logo_image(:small).present?
      json.small do
        json.url playlist.logo_image(:small).url
        json.width playlist.logo_image(:small).width
        json.height playlist.logo_image(:small).height
      end
    end
  end
else
  json.logo do
    json.main do
      json.url playlist.dummy_image_url('logo')
      json.width 1080
      json.height 1080
    end
  end
end

if playlist.eyecatch_image_url
  # rubocop:disable Metrics/BlockLength
  json.eyecatch do
    json.main do
      json.url playlist.eyecatch_image_url
      json.width playlist.eyecatch_image.width
      json.height playlist.eyecatch_image.height
    end

    if playlist.eyecatch_image(:large).present?
      json.large do
        json.url playlist.eyecatch_image(:large).url
        json.width playlist.eyecatch_image(:large).width
        json.height playlist.eyecatch_image(:large).height
      end
    end

    if playlist.eyecatch_image(:medium).present? && playlist.eyecatch_image.storage_key == :store
      json.medium do
        json.url playlist.eyecatch_image(:medium).url
        json.width playlist.eyecatch_image(:medium).width
        json.height playlist.eyecatch_image(:medium).height
      end
    elsif playlist.eyecatch_image(:medium).blank? && playlist.eyecatch_image.storage_key == :cache
      json.medium do
        json.url TMP_EYECATCH_IMG_UPLOADING
        json.width 640
        json.height 640
      end
    end

    if playlist.eyecatch_image(:small).present?
      json.small do
        json.url playlist.eyecatch_image(:small).url
        json.width playlist.eyecatch_image(:small).width
        json.height playlist.eyecatch_image(:small).height
      end
    end
  end
  # rubocop:enable Metrics/BlockLength
else
  json.eyecatch do
    json.main do
      json.url playlist.dummy_image_url('eyecatch')
      json.width 1920
      json.height 1080
    end
  end
end

if playlist.hero_image_url
  json.hero do
    json.main do
      json.url playlist.hero_image_url
      json.width playlist.hero_image.width
      json.height playlist.hero_image.height
    end

    if playlist.hero_image(:medium).present? && playlist.hero_image.storage_key == :store
      json.medium do
        json.url playlist.hero_image(:medium).url
        json.width playlist.hero_image.width
        json.height playlist.hero_image.height
      end
    elsif playlist.hero_image(:medium).blank? && playlist.hero_image.storage_key == :cache
      json.medium do
        json.url TMP_HERO_IMG_UPLOADING
        json.width 640
        json.height 640
      end
    end
  end
else
  json.hero do
    json.main do
      json.url playlist.dummy_image_url('hero')
      json.width 1920
      json.height 640
    end
  end
end

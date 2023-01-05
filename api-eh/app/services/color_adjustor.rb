# frozen_string_literal: false

class ColorAdjustor
  attr_accessor :base_color

  EPS = 1e-7
  MAX_ITER = 20

  def initialize(base_color)
    @base_color = base_color.paint
  end

  def primary_dark_color
    adjust_color(background_color: '#1f1f20', contrast_ratio: 3.0)
  end

  def primary_light_color
    adjust_color(background_color: '#FAFAFA', contrast_ratio: 3.0)
  end

  def link_dark_color
    adjust_color(background_color: '#1f1f20', contrast_ratio: 4.5)
  end

  def link_light_color
    adjust_color(background_color: '#FAFAFA', contrast_ratio: 4.5)
  end

  private

  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  def adjust_color(background_color:, contrast_ratio:)
    base_color_luminance = luminance(base_color)
    background_color_luminance = luminance(background_color.dup.paint)

    # 背景色が明度（輝度）0.5以上の場合（Light Modeの場合）
    if background_color.dup.paint.light?
      # コントラスト比の計算から調整すべき色のLuminanceを求める
      target_luminance = ((background_color_luminance + 0.05) / contrast_ratio) - 0.05

      # 調整すべき色のLuminanceよりもベース色のLuminanceが明るい場合（背景色に比べ色が明るすぎる場合）
      if base_color_luminance > target_luminance
        convert_color_by_luminance(base_color, target_luminance).to_hex
      else
        base_color.to_hex
      end
    # 背景色が明度（輝度）0.5以下の場合（Dark Modeの場合）
    else
      # コントラスト比の計算から調整すべき色のLuminanceを求める
      target_luminance = ((background_color_luminance + 0.05) * contrast_ratio) - 0.05

      # 調整すべき色のLuminanceよりもベース色のLuminanceが暗い場合（背景色に比べ色が暗すぎる場合）
      if base_color_luminance < target_luminance
        convert_color_by_luminance(base_color, target_luminance).to_hex
      else
        base_color.to_hex
      end
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

  # 参考: https://github.com/gka/chroma.js/blob/5a562f043f7b5ccfbc35db2f55ba0f1e497de63e/src/ops/luminance.js#L40
  def luminance(color)
    r, g, b = color.to_rgb.scan(/\d+/).map(&:to_i)
    (luminance_x(r) * 0.2126) + (luminance_x(g) * 0.7152) + (luminance_x(b) * 0.0722)
  end

  # 輝度を出すための rgb 個々の変数に係数処理をする
  # 参考: https://github.com/gka/chroma.js/blob/5a562f043f7b5ccfbc35db2f55ba0f1e497de63e/src/ops/luminance.js#L49
  def luminance_x(x)
    x /= 255.0
    x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055)**2.4
  end

  # 色と色を ratio に合わせて配合する
  def interpolate(color1, color2, ratio)
    col1 = ColorMath.hex_color(color1.to_hex)
    col2 = ColorMath.hex_color(color2.to_hex)

    combined = ColorMath::Blend.alpha(col1, col2, ratio)
    combined.hex.paint
  end

  # 輝度を指定して、その輝度に近い色を返す
  # 参考: https://github.com/gka/chroma.js/blob/5a562f043f7b5ccfbc35db2f55ba0f1e497de63e/src/ops/luminance.js#L8
  def convert_color_by_luminance(color, target_luminance)
    return Chroma.paint('#FFFFFF') if target_luminance == 1
    return Chroma.paint('#000000') if target_luminance.zero?

    if luminance(color) > target_luminance
      approximate(Chroma.paint('#000000'), color, target_luminance, MAX_ITER)
    else
      approximate(color, Chroma.paint('#FFFFFF'), target_luminance, MAX_ITER)
    end
  end

  # 与えられた色、輝度に応じて近似処理を行う
  # 参考: https://github.com/gka/chroma.js/blob/5a562f043f7b5ccfbc35db2f55ba0f1e497de63e/src/ops/luminance.js#L23
  def approximate(low, high, target_luminance, max_iteration)
    mid = interpolate(low, high, 0.5)
    luminance = luminance(mid)

    return mid if (target_luminance - luminance).abs < EPS || max_iteration <= 0

    if luminance > target_luminance
      approximate(low, mid, target_luminance, max_iteration - 1)
    else
      approximate(mid, high, target_luminance, max_iteration - 1)
    end
  end
end

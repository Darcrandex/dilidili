declare namespace MainProcess {
  interface DownloadBVParams {
    videoDownloadUrl: string // 视频下载地址
    audioDownloadUrl: string // 音频下载地址
    coverImageUrl: string // 封面图片地址

    ownerId: string // up id
    bvid: string // 视频id
    page: number // 分P序号
    quality: number // 质量编号
  }

  // 视频基本信息

  interface VideoInfoSchema {
    aid: number
    bvid: string
    cid: number
    title: string
    pic: string
    duration: number
    owner: Owner
    pages: Page[]
  }

  interface Owner {
    mid: number
    name: string
    face: string
  }

  interface Page {
    cid: number
    page: number
    part: string
    duration: number
  }

  // 视频分P信息
  interface PageInfoSchema {
    dash: {
      duration: number // 视频时长（秒）

      video: Array<{
        id: number
        baseUrl: string
        bandwidth: number // 码率
      }>
      audio: Array<{
        id: number
        baseUrl: string
        bandwidth: number
      }>
    }
    support_formats: Array<{
      quality: number
      new_description: string
    }>
  }

  interface UserProfileShchema {
    isLogin: boolean
    email_verified: number
    face: string
    face_nft: number
    face_nft_type: number
    level_info: {
      current_level: number
      current_min: number
      current_exp: number
      next_exp: number
    }
    mid: number
    mobile_verified: number
    money: number
    moral: number
    official: {
      role: number
      title: string
      desc: string
      type: number
    }
    officialVerify: {
      type: number
      desc: string
    }
    pendant: {
      pid: number
      name: string
      image: string
      expire: number
      image_enhance: string
      image_enhance_frame: string
      n_pid: number
    }
    scores: number
    uname: string
    vipDueDate: number
    vipStatus: number
    vipType: number
    vip_pay_type: number
    vip_theme_type: number
    vip_label: {
      path: string
      text: string
      label_theme: string
      text_color: string
      bg_style: number
      bg_color: string
      border_color: string
      use_img_label: boolean
      img_label_uri_hans: string
      img_label_uri_hant: string
      img_label_uri_hans_static: string
      img_label_uri_hant_static: string
    }
    vip_avatar_subscript: number
    vip_nickname_color: string
    vip: {
      type: number
      status: number
      due_date: number
      vip_pay_type: number
      theme_type: number
      label: {
        path: string
        text: string
        label_theme: string
        text_color: string
        bg_style: number
        bg_color: string
        border_color: string
        use_img_label: boolean
        img_label_uri_hans: string
        img_label_uri_hant: string
        img_label_uri_hans_static: string
        img_label_uri_hant_static: string
      }
      avatar_subscript: number
      nickname_color: string
      role: number
      avatar_subscript_url: string
      tv_vip_status: number
      tv_vip_pay_type: number
      tv_due_date: number
      avatar_icon: {
        icon_type: number
      }
    }
    wallet: {
      mid: number
      bcoin_balance: number
      coupon_balance: number
      coupon_due_time: number
    }
    has_shop: boolean
    shop_url: string
    allowance_count: number
    answer_status: number
    is_senior_member: number
    wbi_img: {
      img_url: string
      sub_url: string
    }
    is_jury: boolean
  }
}

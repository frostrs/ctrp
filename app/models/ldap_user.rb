# == Schema Information
#
# Table name: users
#
#  id                          :integer          not null, primary key
#  email                       :string           default(""), not null
#  encrypted_password          :string           default(""), not null
#  reset_password_token        :string
#  reset_password_sent_at      :datetime
#  sign_in_count               :integer          default(0), not null
#  current_sign_in_at          :datetime
#  last_sign_in_at             :datetime
#  current_sign_in_ip          :inet
#  last_sign_in_ip             :inet
#  confirmation_token          :string
#  confirmed_at                :datetime
#  confirmation_sent_at        :datetime
#  unconfirmed_email           :string
#  failed_attempts             :integer          default(0), not null
#  unlock_token                :string
#  locked_at                   :datetime
#  created_at                  :datetime
#  updated_at                  :datetime
#  first_name                  :string
#  last_name                   :string
#  street_address              :text
#  zipcode                     :string
#  country                     :string
#  state                       :string
#  middle_name                 :string
#  prs_organization_name       :string
#  receive_email_notifications :boolean
#  role_requested              :string
#  approved                    :boolean          default(FALSE), not null
#  organization_id             :integer
#  source                      :string
#
# Indexes
#
#  index_users_on_approved              (approved)
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_organization_id       (organization_id)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#

class LdapUser < User
  devise :ldap_authenticatable, :rememberable, :trackable
end

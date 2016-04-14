# == Schema Information
#
# Table name: tempgrants
#
#  id                :integer          not null, primary key
#  serial_number     :integer
#  institution_name  :string
#  project_title     :string
#  funding_mechanism :string
#  institute_code    :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  pi_full_name      :string(255)
#

class Tempgrants < ActiveRecord::Base
end

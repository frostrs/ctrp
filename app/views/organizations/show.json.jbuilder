json.extract! @organization,
              :id,
              :source_id,
              :name,
              :address,
              :address2,
              :address3,
              :processing_status,
              :city,
              :state_province,
              :postal_code,
              :country,
              :email,
              :phone,
              :extension,
              :ctrp_id,
              :source_context_id,
              :source_status_id,
              :families,
              :name_aliases,
              :created_by,
              :updated_by,
              :ctep_id,
              :cluster,
              :uuid,
              :lock_version,
              :org_created_date,
              :org_updated_date
          json.context_change (@nlmchange || @ctepchange)

# p @organization.created_at
# p @organization.updated_at
# p @organization.org_created_date

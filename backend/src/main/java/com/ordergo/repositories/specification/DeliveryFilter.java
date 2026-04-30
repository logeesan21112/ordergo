package com.ordergo.repositories.specification;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import com.ordergo.models.Delivery;
import java.util.ArrayList;
import java.util.List;

public class DeliveryFilter {
    public static Specification<Delivery> byFilter(String searchValue) {
        return (root, query, criteriaBuilder) -> {
            if (searchValue == null || searchValue.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            String searchPattern = "%" + searchValue.toLowerCase() + "%";
            List<Predicate> predicates = new ArrayList<>();

            // Create joins ONCE and reuse
            var userJoin = root.join("user", JoinType.LEFT);
            var vendorJoin = root.join("vendor", JoinType.LEFT);

            // Delivery fields
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("paymentStatus").as(String.class)), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("incomeType").as(String.class)), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), searchPattern));

            // User fields
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("name")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("email")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("phoneNumber")), searchPattern));

            // Vendor fields
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(vendorJoin.get("name")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(vendorJoin.get("email")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(vendorJoin.get("address")), searchPattern));
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(vendorJoin.get("phoneNumber")), searchPattern));

            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Delivery> byMonthAndYear(int month, int year) {
        return (root, query, criteriaBuilder) -> {
            Expression<Integer> monthExpression = criteriaBuilder.function("month", Integer.class, root.get("createdAt"));
            Expression<Integer> yearExpression = criteriaBuilder.function("year", Integer.class, root.get("createdAt"));
            Predicate monthPredicate = criteriaBuilder.equal(monthExpression, month);
            Predicate yearPredicate = criteriaBuilder.equal(yearExpression, year);
            return criteriaBuilder.and(monthPredicate, yearPredicate);
        };
    }
}